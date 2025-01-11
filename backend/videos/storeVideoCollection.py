from db.db import mongo_db

mentalHealthVideos = [
    {
        "category": "Emotional regulation",
        "videos": [
            {
                "video_title": "Managing Anxiety",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
            {
                "video_title": "Breathing Exercises for Anxiety",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
        ],
    },
    {
        "category": "Coping mechanisms",
        "videos": [
            {
                "video_title": "Understanding Depression",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
            {
                "video_title": "Overcoming Negative Thoughts",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
        ],
    },
    {
        "category": "Mindfulness and meditation",
        "videos": [
            {
                "video_title": "Stress Relief Techniques",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
            {
                "video_title": "Mindful Stress Management",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
        ],
    },
    {
        "category": "Resilience building",
        "videos": [
            {
                "video_title": "Managing Anxiety",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
            {
                "video_title": "Breathing Exercises for Anxiety",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
        ],
    },
    {
        "category": "Anger management",
        "videos": [
            {
                "video_title": "Understanding Depression",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
            {
                "video_title": "Overcoming Negative Thoughts",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
        ],
    },
    {
        "category": "Social anxiety",
        "videos": [
            {
                "video_title": "Stress Relief Techniques",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
            {
                "video_title": "Mindful Stress Management",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
        ],
    },
    {
        "category": "Relationship issues",
        "videos": [
            {
                "video_title": "Managing Anxiety",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
            {
                "video_title": "Breathing Exercises for Anxiety",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
        ],
    },
    {
        "category": "Loneliness and isolation",
        "videos": [
            {
                "video_title": "Understanding Depression",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
            {
                "video_title": "Overcoming Negative Thoughts",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
        ],
    },
    {
        "category": "Healthy boundaries",
        "videos": [
            {
                "video_title": "Stress Relief Techniques",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
            {
                "video_title": "Mindful Stress Management",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
        ],
    },
    {
        "category": "Peer pressure and bullying",
        "videos": [
            {
                "video_title": "Managing Anxiety",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
            {
                "video_title": "Breathing Exercises for Anxiety",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
        ],
    },
    {
        "category": "Nutrition and mental health",
        "videos": [
            {
                "video_title": "Understanding Depression",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
            {
                "video_title": "Overcoming Negative Thoughts",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
        ],
    },
    {
        "category": "Exercise and mental well-being",
        "videos": [
            {
                "video_title": "Stress Relief Techniques",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
            {
                "video_title": "Mindful Stress Management",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
        ],
    },
    {
        "category": "Procrastination and problem solving",
        "videos": [
            {
                "video_title": "Managing Anxiety",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
            {
                "video_title": "Breathing Exercises for Anxiety",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
        ],
    },
    {
        "category": "Brain health",
        "videos": [
            {
                "video_title": "Understanding Depression",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
            {
                "video_title": "Overcoming Negative Thoughts",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
        ],
    },
    {
        "category": "Burnout",
        "videos": [
            {
                "video_title": "Stress Relief Techniques",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
            {
                "video_title": "Mindful Stress Management",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
        ],
    },
    {
        "category": "Mind-body connection",
        "videos": [
            {
                "video_title": "Stress Relief Techniques",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
            {
                "video_title": "Mindful Stress Management",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
        ],
    },
    {
        "category": "Art and music therapy",
        "videos": [
            {
                "video_title": "Stress Relief Techniques",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
            {
                "video_title": "Mindful Stress Management",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
        ],
    },
    {
        "category": "Digital detox and screen time effects",
        "videos": [
            {
                "video_title": "Stress Relief Techniques",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
            {
                "video_title": "Mindful Stress Management",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
        ],
    },
    {
        "category": "Spiritual and mental health",
        "videos": [
            {
                "video_title": "Stress Relief Techniques",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
            {
                "video_title": "Mindful Stress Management",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
        ],
    },
    {
        "category": "Depression",
        "videos": [
            {
                "video_title": "Stress Relief Techniques",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
            {
                "video_title": "Mindful Stress Management",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
        ],
    },
    {
        "category": "Stress management",
        "videos": [
            {
                "video_title": "Stress Relief Techniques",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
            {
                "video_title": "Mindful Stress Management",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
        ],
    },
    {
        "category": "Sleep improvement",
        "videos": [
            {
                "video_title": "Stress Relief Techniques",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
            {
                "video_title": "Mindful Stress Management",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
        ],
    },
    {
        "category": "Self-esteem and confidence",
        "videos": [
            {
                "video_title": "Stress Relief Techniques",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
            {
                "video_title": "Mindful Stress Management",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
        ],
    },
    {
        "category": "Motivation",
        "videos": [
            {
                "video_title": "Stress Relief Techniques",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
            {
                "video_title": "Mindful Stress Management",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
        ],
    },
    {
        "category": "Love",
        "videos": [
            {
                "video_title": "Stress Relief Techniques",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
            {
                "video_title": "Mindful Stress Management",
                "video_url": "https://www.youtube.com/embed/IOaelrDLNo4",
            },
        ],
    },
]


def store_videos():
    mongo_db.video_library.insert_many(mentalHealthVideos)