# Expert System for Personalized Learning

This module implements an AI-powered expert system that provides personalized learning recommendations based on student activity, learning style, and performance.

## Features

- **Learning Profile Analysis**: Tracks and analyzes student learning styles, preferences, and performance
- **Personalized Recommendations**: Provides tailored recommendations for courses, topics, learning methods, and resources
- **Activity-Based Learning Style Detection**: Automatically detects a student's dominant learning style based on their platform activity
- **Performance Analytics**: Identifies skill gaps and struggling topics based on exam submissions
- **Optimal Study Pattern Recognition**: Suggests optimal study duration and patterns based on past activity
- **Rule-Based Student Evaluation**: Analyzes student behavior and performance using seven specialized rules

## Setup Instructions

1. Make sure you have set up your `.env` file with the following variables:

```
# Google Gemini app configuration for expert system
GEMINI_app_KEY=your_gemini_app_key_here
```

2. Run database migrations to create the necessary tables:

```bash
npm run migration:run
```

## Api Endpoints

### Learning Profile

- `GET /app/expert-system/profile` - Get the current user's learning profile
- `PUT /app/expert-system/profile` - Update the current user's learning profile
- `POST /app/expert-system/profile/update-from-activity` - Update profile based on user activity

### Recommendations

- `GET /app/expert-system/recommendations` - Get personalized recommendations
- `POST /app/expert-system/recommendations/refresh` - Force refresh recommendations
- `PUT /app/expert-system/recommendations/{id}/complete` - Mark recommendation as completed
- `PUT /app/expert-system/recommendations/{id}/dismiss` - Dismiss a recommendation

### Student Evaluation

- `GET /app/expert-system/evaluate` - Get comprehensive rule-based evaluation of the current student

## Student Evaluation Response Structure

The `/evaluate` endpoint returns a comprehensive analysis of student performance with the following structure:

```typescript
{
  "success": true,
  "data": {
    "userId": number,
    "engagementScore": number,
    "engagementLevel": "disengaged" | "normal" | "highly engaged",
    "topicMasteryMap": {
      [topicName: string]: {
        "score": number,
        "level": "needs review" | "developing" | "proficient" | "mastered"
      }
    },
    "learningVelocity": number,
    "learningVelocityCategory": "slow" | "average" | "fast",
    "attentionSpanIssues": string[],
    "effectiveResources": string[],
    "procrastinationLevel": "low" | "medium" | "high",
    "recommendedLearningPath": string[]
  }
}
```

### Evaluation Rules

The system analyzes student data using seven specialized rules:

1. **Engagement Scoring Rule**: Analyzes view time and interaction count
2. **Topic Mastery Rule**: Combines exam scores (70%) and time spent (30%)
3. **Learning Velocity Rule**: Measures improvement rate over time
4. **Attention Span Rule**: Identifies issues with study session patterns
5. **Resource Utilization Rule**: Identifies most effective learning resources
6. **Procrastination Detection Rule**: Analyzes activity patterns before deadlines
7. **Learning Path Optimization Rule**: Suggests personalized learning paths

## Technical Implementation

The expert system uses the following components:

1. **Data Collection**: Gathers user activity, exam submissions, and learning patterns
2. **AI Analysis**: Uses Google Gemini to analyze data and generate personalized recommendations
3. **Learning Profile**: Maintains a profile of each user's learning style and preferences
4. **Recommendation Engine**: Provides tailored recommendations based on the user's profile
5. **Rules Engine**: Applies specialized rules to analyze student behavior and performance

## Integration with Frontend

The frontend can integrate with this expert system by:

1. Displaying the user's learning profile in their dashboard
2. Showing personalized recommendations in a dedicated section
3. Allowing users to complete or dismiss recommendations
4. Providing a learning style quiz to manually update the profile
5. Displaying comprehensive evaluation results in a student performance dashboard

### Accurate Activity Tracking

For accurate tracking of student activities, the frontend should provide the actual page information:

1. **Set the `X-Current-Page` header** in API requests:
   ```javascript
   axios.get('/api/endpoint', {
     headers: {
       'X-Current-Page': '/course/123/lesson/456'
     }
   });
   ```

2. **Or include a `page_location` query parameter** with API requests:
   ```javascript
   axios.get('/api/endpoint?page_location=/course/123/lesson/456');
   ```

This ensures that the expert system has accurate information about which pages students are actually viewing, rather than just recording API endpoints.

## Future Enhancements

- Implement collaborative filtering for recommendations
- Add more detailed topic proficiency tracking
- Integrate with content recommendation systems
- Develop a more sophisticated learning style detection algorithm
- Extend the rule-based evaluation system with additional student performance metrics 