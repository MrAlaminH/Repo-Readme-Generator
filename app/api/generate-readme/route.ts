// import { NextRequest, NextResponse } from 'next/server';
// import axios from 'axios';
// import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY || '',
//   baseURL: process.env.OPENAI_API_BASE, 
// });

// export async function POST(req: NextRequest) {
//   const { repoUrl, apiEndpoint } = await req.json();

//   if (!repoUrl) {
//     return NextResponse.json({ error: 'GitHub repository URL is required' }, { status: 400 });
//   }

//   try {
//     let repoData;

//     const formattedRepoUrl = repoUrl.replace('https://github.com/', '');

//     if (apiEndpoint) {
//       // Use the user's API endpoint to fetch repository data
//       repoData = await axios.get(apiEndpoint, { params: { repoUrl } });
//     } else {
//       // Fetch repository data from GitHub API
//       repoData = await axios.get(`https://api.github.com/repos/${formattedRepoUrl}`);
//     }

//     if (!repoData.data) {
//       throw new Error('Failed to fetch repository data');
//     }

//     const repoInfo = repoData.data;

//     const completion = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: [
//         {
//           role: 'user',
//           content: `Generate a detailed README in markdown format for the following repository:\n\n${JSON.stringify(repoInfo, null, 2)}`,
//         },
//       ],
//     });

//     if (completion.choices.length) {
//       return NextResponse.json({ result: completion.choices[0].message.content }, { status: 200 });
//     } else {
//       return NextResponse.json({ error: 'No response from OpenAI' }, { status: 500 });
//     }
//   } catch (error: any) {
//     if (error.response) {
//       console.error('API error:', error.response.data);
//       return NextResponse.json({ error: error.response.data.error.message }, { status: error.response.status });
//     } else if (error.request) {
//       console.error('Network error or no response received:', error.message);
//       return NextResponse.json({ error: 'No response received from API' }, { status: 500 });
//     } else {
//       console.error('Unexpected error:', error.message);
//       return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
//     }
//   }
// }


import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  baseURL: process.env.OPENAI_API_BASE, 
});

export async function POST(req: NextRequest) {
  const { repoUrl, apiEndpoint, githubApiKey } = await req.json();

  if (!repoUrl) {
    return NextResponse.json({ error: 'GitHub repository URL is required' }, { status: 400 });
  }

  try {
    let repoData;

    const formattedRepoUrl = repoUrl.replace('https://github.com/', '');

    if (apiEndpoint) {
      // Use the user's API endpoint to fetch repository data
      repoData = await axios.get(apiEndpoint, { params: { repoUrl } });
    } else {
      // Fetch repository data from GitHub API
      repoData = await axios.get(`https://api.github.com/repos/${formattedRepoUrl}`, {
        headers: {
          'Authorization': `token ${githubApiKey}`
        }
      });
    }

    if (!repoData.data) {
      throw new Error('Failed to fetch repository data');
    }

    const repoInfo = repoData.data;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini-2024-07-18',
      messages: [
        {
          role: 'user',
          content: `You are an AI assistant specialized in generating README files for software projects. Your task is to create a comprehensive README for a given GitHub repository based on the provided code files and metadata. The README should follow a standard format and cover essential information that helps users and developers understand the project. Consider the following instructions and details to generate the README:

1. Project Title and Description:
   - Extract the main idea and purpose of the project from the codebase, file names, and any existing comments or documentation.
   - Provide a concise summary describing what the project does and its key features.

2. Installation Instructions:
   - Identify the programming language(s) and framework(s) used in the project.
   - List the steps required to install the project locally. Include commands to clone the repository, install dependencies, and set up the environment.

3. Usage:
   - Provide examples of how to use the project. If there is a main entry point (e.g., index.js, main.py), describe how to run it.
   - If there are specific commands, scripts, or functionalities, explain them clearly.

4. Contributing Guidelines:
   - If the project has guidelines for contributing (such as a CONTRIBUTING.md file), summarize them. If not, suggest general guidelines for contributing code, reporting issues, or requesting new features.

5. License:
   - Identify the license under which the project is distributed (if available). Include a section on the type of license and what it means for other developers who want to use or modify the code.

6. Dependencies and Technologies Used:
   - List all major dependencies and libraries used in the project. Provide a brief description of each dependency's purpose.

7. Code Structure:
   - Analyze the project folder structure and describe the purpose of each major directory and file. This helps users navigate the codebase more easily.

8. Features:
   - Highlight the key features of the project that make it unique or useful. This could include any standout functions, modules, or tools.

9. Acknowledgments:
   - Include an optional section to acknowledge libraries, tools, or people who have significantly contributed to the project. Instructions:
- Use clear and concise language.
- Organize the README in a way that is easy to read and navigate.
- Ensure the README is beginner-friendly but detailed enough for experienced developers.
- If certain information is not available in the codebase, make reasonable assumptions and provide placeholder text for users to fill in later. make sure if there is any api implemntion then mention that also how to implemnt type of stuff hope you got it:\n\n${JSON.stringify(repoInfo, null, 2)}`,
        },
      ],
    });

    if (completion.choices.length) {
      return NextResponse.json({ result: completion.choices[0].message.content }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'No response from OpenAI' }, { status: 500 });
    }
  } catch (error: any) {
    if (error.response) {
      console.error('API error:', error.response.data);
      return NextResponse.json({ error: error.response.data.error.message }, { status: error.response.status });
    } else if (error.request) {
      console.error('Network error or no response received:', error.message);
      return NextResponse.json({ error: 'No response received from API' }, { status: 500 });
    } else {
      console.error('Unexpected error:', error.message);
      return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
    }
  }
}