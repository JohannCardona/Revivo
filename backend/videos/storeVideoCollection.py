from db.db import mongo_db

mentalHealthVideos = [
    {
        "category": "Emotional regulation",
        "videos": [
            {
                "video_title": "How Healthy People Regulate Their Emotions",
                "video_url": "https://www.youtube.com/embed/1DmphC3Wozo",
            },
            {
                "video_title": "Steps to Improve Your Emotional Intelligence",
                "video_url": "https://www.youtube.com/embed/D6_J7FfgWVc",
            },
        ],
    },
    {
        "category": "Coping mechanisms",
        "videos": [
            {
                "video_title": "Are Your Coping Mechanisms Healthy",
                "video_url": "https://www.youtube.com/embed/XTlDS7ju_28",
            },
            {
                "video_title": "Copying Mechanisms You Shouldn't Ignore",
                "video_url": "https://www.youtube.com/embed/PyIyxeMXKeg",
            },
        ],
    },
    {
        "category": "Mindfulness and meditation",
        "videos": [
            {
                "video_title": "5-Minute Meditation You Can Do Anywhere",
                "video_url": "https://www.youtube.com/embed/inpok4MKVLM",
            },
            {
                "video_title": "How Mindfulness Changes The Emotional Life of Our Brains",
                "video_url": "https://www.youtube.com/embed/7CBfCW67xT8",
            },
        ],
    },
    {
        "category": "Resilience building",
        "videos": [
            {
                "video_title": "Building Resilience",
                "video_url": "https://www.youtube.com/embed/GLAdRgft7pU",
            },
            {
                "video_title": "8 Things Resilient ",
                "video_url": "https://www.youtube.com/embed/RJKbr8VvvbY",
            },
        ],
    },
    {
        "category": "Anger management",
        "videos": [
            {
                "video_title": "Anger Management",
                "video_url": "https://www.youtube.com/embed/a8t5SwmqDnk",
            },
            {
                "video_title": "The Antidote to Anger",
                "video_url": "https://www.youtube.com/embed/hCIfi-xvjgE",
            },
        ],
    },
    {
        "category": "Social anxiety",
        "videos": [
            {
                "video_title": "Social Anxiety in the Modern World",
                "video_url": "https://www.youtube.com/embed/EFhP4wP1TzU",
            },
            {
                "video_title": "How to Overcome Social Anxiety",
                "video_url": "https://www.youtube.com/embed/X_ZKkvhXNJk",
            },
        ],
    },
    {
        "category": "Relationship issues",
        "videos": [
            {
                "video_title": "Incompatible Relationship",
                "video_url": "https://www.youtube.com/embed/qadSvKa2eHY",
            },
            {
                "video_title": "Trauma and The Impact in Relationships",
                "video_url": "https://www.youtube.com/embed/O4iJeAGuhRA",
            },
        ],
    },
    {
        "category": "Loneliness and isolation",
        "videos": [
            {
                "video_title": "How Isolation Affects You",
                "video_url": "https://www.youtube.com/embed/c7_qmkmP-JM",
            },
            {
                "video_title": "Why You Might Feel Lonely",
                "video_url": "https://www.youtube.com/embed/nSVR5AoWUcU",
            },
        ],
    },
    {
        "category": "Healthy boundaries",
        "videos": [
            {
                "video_title": "Good Boundaries Free You",
                "video_url": "https://www.youtube.com/embed/rtsHUeKnkC8",
            },
            {
                "video_title": "Set Healthy Boundaries with Toxic People",
                "video_url": "https://www.youtube.com/embed/A-CqifOE0Nw",
            },
        ],
    },
    {
        "category": "Social pressure",
        "videos": [
            {
                "video_title": "Playing the Game of Social Pressure",
                "video_url": "https://www.youtube.com/embed/ZskcFSsbi9E",
            },
            {
                "video_title": "Peer Pressure or Peer Support",
                "video_url": "https://www.youtube.com/embed/j1Fj88B46F8",
            },
        ],
    },
    {
        "category": "Nutrition and mental health",
        "videos": [
            {
                "video_title": "Understanding Depression",
                "video_url": "https://www.youtube.com/embed/DZqkeMoQA38",
            },
            {
                "video_title": "Overcoming Negative Thoughts",
                "video_url": "https://www.youtube.com/embed/DZqkeMoQA38",
            },
        ],
    },
    {
        "category": "Exercise and mental well-being",
        "videos": [
            {
                "video_title": "Stress Relief Techniques",
                "video_url": "https://www.youtube.com/embed/DZqkeMoQA38",
            },
            {
                "video_title": "Mindful Stress Management",
                "video_url": "https://www.youtube.com/embed/DZqkeMoQA38",
            },
        ],
    },
    {
        "category": "Procrastination and problem solving",
        "videos": [
            {
                "video_title": "Managing Anxiety",
                "video_url": "https://www.youtube.com/embed/DZqkeMoQA38",
            },
            {
                "video_title": "Breathing Exercises for Anxiety",
                "video_url": "https://www.youtube.com/embed/DZqkeMoQA38",
            },
        ],
    },
    {
        "category": "Brain health",
        "videos": [
            {
                "video_title": "Understanding Depression",
                "video_url": "https://www.youtube.com/embed/DZqkeMoQA38",
            },
            {
                "video_title": "Overcoming Negative Thoughts",
                "video_url": "https://www.youtube.com/embed/DZqkeMoQA38",
            },
        ],
    },
    {
        "category": "Burnout",
        "videos": [
            {
                "video_title": "Stress Relief Techniques",
                "video_url": "https://www.youtube.com/embed/DZqkeMoQA38",
            },
            {
                "video_title": "Mindful Stress Management",
                "video_url": "https://www.youtube.com/embed/DZqkeMoQA38",
            },
        ],
    },
    {
        "category": "Mind-body connection",
        "videos": [
            {
                "video_title": "Stress Relief Techniques",
                "video_url": "https://www.youtube.com/embed/DZqkeMoQA38",
            },
            {
                "video_title": "Mindful Stress Management",
                "video_url": "https://www.youtube.com/embed/DZqkeMoQA38",
            },
        ],
    },
    {
        "category": "Art and music therapy",
        "videos": [
            {
                "video_title": "Stress Relief Techniques",
                "video_url": "https://www.youtube.com/embed/DZqkeMoQA38",
            },
            {
                "video_title": "Mindful Stress Management",
                "video_url": "https://www.youtube.com/embed/DZqkeMoQA38",
            },
        ],
    },
    {
        "category": "Digital detox and screen time effects",
        "videos": [
            {
                "video_title": "Stress Relief Techniques",
                "video_url": "https://www.youtube.com/embed/DZqkeMoQA38",
            },
            {
                "video_title": "Mindful Stress Management",
                "video_url": "https://www.youtube.com/embed/DZqkeMoQA38",
            },
        ],
    },
    {
        "category": "Spiritual and mental health",
        "videos": [
            {
                "video_title": "Stress Relief Techniques",
                "video_url": "https://www.youtube.com/embed/DZqkeMoQA38",
            },
            {
                "video_title": "Mindful Stress Management",
                "video_url": "https://www.youtube.com/embed/DZqkeMoQA38",
            },
        ],
    },
    {
        "category": "Depression",
        "videos": [
            {
                "video_title": "Stress Relief Techniques",
                "video_url": "https://www.youtube.com/embed/DZqkeMoQA38",
            },
            {
                "video_title": "Mindful Stress Management",
                "video_url": "https://www.youtube.com/embed/DZqkeMoQA38",
            },
        ],
    },
    {
        "category": "Stress management",
        "videos": [
            {
                "video_title": "Stress Relief Techniques",
                "video_url": "https://www.youtube.com/embed/DZqkeMoQA38",
            },
            {
                "video_title": "Mindful Stress Management",
                "video_url": "https://www.youtube.com/embed/DZqkeMoQA38",
            },
        ],
    },
    {
        "category": "Sleep improvement",
        "videos": [
            {
                "video_title": "Stress Relief Techniques",
                "video_url": "https://www.youtube.com/embed/DZqkeMoQA38",
            },
            {
                "video_title": "Mindful Stress Management",
                "video_url": "https://www.youtube.com/embed/DZqkeMoQA38",
            },
        ],
    },
    {
        "category": "Self-esteem and confidence",
        "videos": [
            {
                "video_title": "Stress Relief Techniques",
                "video_url": "https://www.youtube.com/embed/DZqkeMoQA38",
            },
            {
                "video_title": "Mindful Stress Management",
                "video_url": "https://www.youtube.com/embed/DZqkeMoQA38",
            },
        ],
    },
    {
        "category": "Motivation",
        "videos": [
            {
                "video_title": "Stress Relief Techniques",
                "video_url": "https://www.youtube.com/embed/DZqkeMoQA38",
            },
            {
                "video_title": "Mindful Stress Management",
                "video_url": "https://www.youtube.com/embed/DZqkeMoQA38",
            },
        ],
    },
    {
        "category": "Love",
        "videos": [
            {
                "video_title": "Stress Relief Techniques",
                "video_url": "https://www.youtube.com/embed/DZqkeMoQA38",
            },
            {
                "video_title": "Mindful Stress Management",
                "video_url": "https://www.youtube.com/embed/DZqkeMoQA38",
            },
        ],
    },
]


def store_videos():
    mongo_db.video_library.insert_many(mentalHealthVideos)