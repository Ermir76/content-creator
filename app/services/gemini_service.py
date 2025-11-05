import os
from typing import Dict, List

import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini API
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY environment variable is not set")

genai.configure(api_key=GOOGLE_API_KEY)  # type: ignore

# Platform-specific configuration
PLATFORM_SPECS = {
    "linkedin": {
        "char_limit": 3000,
        "tone": "professional and thought-provoking",
        "features": "Use line breaks for readability, include relevant hashtags (3-5), and encourage engagement",
        "format": "Start with a hook, provide value, end with a call-to-action"
    },
    "twitter": {
        "char_limit": 280,
        "tone": "concise and engaging",
        "features": "Use 1-2 relevant hashtags, make every word count",
        "format": "Hook in first line, deliver value quickly"
    },
    "reddit": {
        "char_limit": 40000,
        "tone": "conversational and authentic",
        "features": "Be genuine, avoid corporate speak, provide real value to the community",
        "format": "Engaging title mindset, detailed explanation, encourage discussion"
    },
    "instagram": {
        "char_limit": 2200,
        "tone": "visual and inspiring",
        "features": "Use emojis strategically, include 10-15 relevant hashtags at the end, line breaks for readability",
        "format": "Attention-grabbing opening, storytelling, call-to-action, hashtags at the end"
    }
}


def generate_content_for_platforms(
    idea_prompt: str,
    voice_profile: str,
    platforms: List[str]
) -> Dict[str, str]:
    """
    Generate platform-specific social media content using Google Gemini AI.
    
    Args:
        idea_prompt: The content idea or topic to create posts about
        voice_profile: Writing style and tone preferences
        platforms: List of platform names (e.g., ['linkedin', 'twitter', 'reddit', 'instagram'])
    
    Returns:
        Dictionary mapping platform names to generated content text
    """
    model = genai.GenerativeModel('gemini-2.0-flash')  # type: ignore
    generated_content = {}
    
    for platform in platforms:
        platform_lower = platform.lower()
        
        # Get platform specifications or use defaults
        specs = PLATFORM_SPECS.get(platform_lower, {
            "char_limit": 2000,
            "tone": "engaging and authentic",
            "features": "Clear and valuable content",
            "format": "Hook, value, call-to-action"
        })
        
        # Construct platform-specific prompt
        prompt = f"""Create a social media post for {platform.upper()} based on the following:

CONTENT IDEA: {idea_prompt}

WRITING STYLE: {voice_profile}

PLATFORM REQUIREMENTS FOR {platform.upper()}:
- Character limit: {specs['char_limit']}
- Tone: {specs['tone']}
- Features: {specs['features']}
- Format: {specs['format']}

INSTRUCTIONS:
1. Write ONLY the post content, nothing else
2. Do not include meta-commentary like "Here's a post..." or "This post..."
3. Stay within the character limit
4. Match the specified tone and writing style
5. Follow the platform's best practices
6. Make it engaging and valuable to the audience

Generate the post now:"""

        try:
            # Call Gemini API
            response = model.generate_content(prompt)
            generated_text = response.text.strip()
            
            # Store the generated content
            generated_content[platform] = generated_text
            
        except Exception as e:
            # If generation fails for a platform, store error message
            generated_content[platform] = f"Error generating content: {str(e)}"
    
    return generated_content
