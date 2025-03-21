import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from openai import OpenAI
from openai import APIConnectionError, APIError, RateLimitError, AuthenticationError

# Set the title of the app
st.title("Quiz Performance Visualizer")

# Initialize the OpenAI client
try:
    api_key = "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"  # Read API key from secrets.toml
    client = OpenAI(api_key=api_key)
except KeyError:
    st.error("OpenAI API key is missing. Please add it to the `secrets.toml` file.")
    st.stop()
except AuthenticationError as e:
    st.error(f"Authentication failed: {e}")
    st.stop()
except Exception as e:
    st.error(f"Failed to initialize OpenAI client: {e}")
    st.stop()

# Sample JSON data (this will come directly from the getscore method)
details = {
    "success": True,
    "scores": [
        {
            "_id": "67dc63e3102277492db9c6e0",
            "classroomId": {
                "_id": "67dbe7cb5218196965a830ad",
                "name": "Mathematics 101",
                "description": "Introduction to Algebra and Geometry",
                "learnerCount": 26,
                "__v": 0
            },
            "email": "alice.johnson@example.com",  # Use 'email' instead of 'learnerId'
            "quizId": None,
            "scores": [
                {
                    "questions": "What is AI?",
                    "answers": "Artificial Intelligence",
                    "gptScore": 0.9,
                    "_id": "67dc63e3102277492db9c6e1"
                },
                {
                    "questions": "What is ML?",
                    "answers": "Machine Learning",
                    "gptScore": 1,
                    "_id": "67dc63e3102277492db9c6e2"
                }
            ],
            "totalScore": 1.9,
            "comments": "Good job!",
            "createdAt": "2025-03-20T18:52:19.099Z",
            "updatedAt": "2025-03-20T18:52:19.099Z",
            "__v": 0
        },
        {
            "_id": "67dc863d719392dc832e28a3",
            "classroomId": {
                "_id": "67dbe7cb5218196965a830ad",
                "name": "Mathematics 101",
                "description": "Introduction to Algebra and Geometry",
                "learnerCount": 26,
                "__v": 0
            },
            "email": "alice.johnson@example.com",  # Use 'email' instead of 'learnerId'
            "quizId": None,
            "scores": [
                {
                    "question": "What is the name of the galaxy that contains our solar system?",
                    "userAnswer": "milky way",
                    "correctAnswer": "The Milky Way",
                    "score": 1,
                    "_id": "67dc863d719392dc832e28a4"
                },
                {
                    "question": "What planet is known as the Red Planet?",
                    "userAnswer": "mars",
                    "correctAnswer": "Mars",
                    "score": 1,
                    "_id": "67dc863d719392dc832e28a5"
                },
                {
                    "question": "What is the largest planet in our solar system?",
                    "userAnswer": "mars",
                    "correctAnswer": "Jupiter",
                    "score": 0,
                    "_id": "67dc863d719392dc832e28a6"
                }
            ],
            "createdAt": "2025-03-20T21:18:53.048Z",
            "updatedAt": "2025-03-20T21:18:53.048Z",
            "__v": 0
        }
    ]
}

# Function to extract scores dynamically
def extract_scores(scores):
    """
    Dynamically extract scores from the nested structure.
    Handles both 'gptScore' and 'score' fields.
    """
    total = 0
    for item in scores:
        if "gptScore" in item:
            total += item["gptScore"]
        elif "score" in item:
            total += item["score"]
    return total

# Convert JSON data to a DataFrame
scores_list = details["scores"]
df = pd.DataFrame(scores_list)

# Calculate total scores dynamically
df["total_score"] = df["scores"].apply(lambda x: extract_scores(x))
df["total_score_percentage"] = df["total_score"] * 100  # Convert to percentage

# Display the data
st.write("### Quiz Data")
st.write(df)

# Visualization 1: Interactive Bar Plot for Total Scores
st.write("### Total Score vs Email")
fig1 = px.bar(
    df,
    x="email",  # Use 'email' instead of 'learnerId'
    y="total_score_percentage",
    labels={"email": "Email", "total_score_percentage": "Total Score (%)"},
    title="Total Score of Each Learner",
    text="total_score_percentage",
    color="email",  # Use 'email' instead of 'learnerId'
)
fig1.update_traces(texttemplate="%{text:.2f}%", textposition="outside")
st.plotly_chart(fig1, use_container_width=True)

# Visualization 2: Pie Chart for Pass/Fail Distribution
passing_marks = 50  # Passing marks (50%)
df["status"] = df["total_score_percentage"].apply(lambda x: "Pass" if x >= passing_marks else "Fail")
st.write("### Pass/Fail Distribution")
fig2 = px.pie(
    df,
    names="status",
    title="Percentage of Students Who Passed/Failed",
    color="status",
    color_discrete_map={"Pass": "green", "Fail": "red"},
)
st.plotly_chart(fig2, use_container_width=True)

# Visualization 3: Interactive Line Plot for Student Progress
st.write("### Student Progress Over Quizzes")

# Extract quiz scores for each learner
quiz_scores = {
    "Email": df["email"],  # Use 'email' instead of 'learnerId'
    "Quiz 1": [
        extract_scores(learner["scores"]) / len(learner["scores"]) * 100 
        for learner in scores_list
    ],
}
df_quizzes = pd.DataFrame(quiz_scores)

# Select a learner to view progress
selected_learner = st.selectbox("Select Email", df_quizzes["Email"])  # Use 'Email' instead of 'Learner ID'
learner_data = df_quizzes[df_quizzes["Email"] == selected_learner]

# Plot progress
fig3 = px.line(
    learner_data.melt(id_vars=["Email"], var_name="Quiz", value_name="Score"),  # Use 'Email' instead of 'Learner ID'
    x="Quiz",
    y="Score",
    title=f"Progress of {selected_learner}",
    markers=True,
    text="Score",
)
fig3.update_traces(textposition="top center")
fig3.update_yaxes(range=[0, 100])  # Assuming scores are out of 100
st.plotly_chart(fig3, use_container_width=True)

# Visualization 4: Heatmap for Quiz-Wise Performance
st.write("### Quiz-Wise Performance Heatmap")
heatmap_data = df_quizzes.set_index("Email")  # Use 'Email' instead of 'Learner ID'
fig4 = go.Figure(data=go.Heatmap(
    z=heatmap_data.values,
    x=heatmap_data.columns,
    y=heatmap_data.index,
    colorscale="Viridis",
    text=heatmap_data.values,
    texttemplate="%{text:.2f}%",
))
fig4.update_layout(
    title="Quiz-Wise Performance of Students",
    xaxis_title="Quiz",
    yaxis_title="Email",  # Use 'Email' instead of 'Learner ID'
)
st.plotly_chart(fig4, use_container_width=True)

# --- Gen AI Features ---

# Function to generate feedback using Gen AI
def generate_feedback(learner_performance):
    """
    Generate feedback for a learner using OpenAI's GPT.
    """
    try:
        prompt = f"The learner scored {learner_performance}% on the quiz. Provide constructive feedback and suggestions for improvement."
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Use the appropriate GPT model
            messages=[{"role": "user", "content": prompt}],
            max_tokens=100,  # Limit the response length
            temperature=0.7,  # Control creativity
        )
        return response.choices[0].message.content
    except APIConnectionError as e:
        st.error(f"Failed to connect to OpenAI API: {e}")
    except APIError as e:
        st.error(f"OpenAI API returned an error: {e}")
    except RateLimitError as e:
        st.error(f"OpenAI API rate limit exceeded: {e}")
    except Exception as e:
        st.error(f"An unexpected error occurred: {e}")
    return "Failed to generate feedback. Please try again later."

# Add a section for Gen AI feedback
st.write("### AI-Generated Feedback")
selected_learner_feedback = st.selectbox("Select Email for Feedback", df["email"])  # Use 'email' instead of 'learnerId'
learner_performance = df[df["email"] == selected_learner_feedback]["total_score_percentage"].values[0]

if st.button("Generate Feedback"):
    feedback = generate_feedback(learner_performance)
    st.write(f"**Feedback for {selected_learner_feedback}:**")
    st.write(feedback)

# Function to interact with the chatbot
def chatbot_response(user_input):
    """
    Generate a response using OpenAI's GPT.
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": user_input}],
            max_tokens=100,
            temperature=0.7,
        )
        return response.choices[0].message.content
    except APIConnectionError as e:
        st.error(f"Failed to connect to OpenAI API: {e}")
    except APIError as e:
        st.error(f"OpenAI API returned an error: {e}")
    except RateLimitError as e:
        st.error(f"OpenAI API rate limit exceeded: {e}")
    except Exception as e:
        st.error(f"An unexpected error occurred: {e}")
    return "Failed to generate a response. Please try again later."

# Add a chatbot section
st.write("### AI Chatbot for Learner Queries")
user_input = st.text_input("Ask a question about your performance or the course:")
if user_input:
    response = chatbot_response(user_input)
    st.write(f"**AI Response:**")
    st.write(response)

# Function to generate new questions
def generate_question(topic):
    """
    Generate a new quiz question using OpenAI's GPT.
    """
    try:
        prompt = f"Generate a quiz question about {topic}."
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=50,
            temperature=0.7,
        )
        return response.choices[0].message.content
    except APIConnectionError as e:
        st.error(f"Failed to connect to OpenAI API: {e}")
    except APIError as e:
        st.error(f"OpenAI API returned an error: {e}")
    except RateLimitError as e:
        st.error(f"OpenAI API rate limit exceeded: {e}")
    except Exception as e:
        st.error(f"An unexpected error occurred: {e}")
    return "Failed to generate a question. Please try again later."

# Add a section for dynamic question generation
st.write("### AI-Generated Quiz Questions")
topic = st.text_input("Enter a topic for a new quiz question:")
if topic:
    question = generate_question(topic)
    st.write(f"**Generated Question:**")
    st.write(question)