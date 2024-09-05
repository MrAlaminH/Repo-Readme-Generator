// // import { NextRequest, NextResponse } from 'next/server';
// // import axios from 'axios'; // Importing Axios
// // import OpenAI from 'openai'; // Using the latest OpenAI library

// // const openai = new OpenAI({
// //   apiKey: process.env.OPENAI_API_KEY || '', // Ensure the API key is set in your environment
// //   baseURL: process.env.OPENAI_API_BASE, // Optional: Set a custom base URL if needed
// // });

// // export async function POST(req: NextRequest) {
// //   const { repoUrl, apiEndpoint } = await req.json();

// //   if (!repoUrl || !apiEndpoint) {
// //     return NextResponse.json({ error: 'Both repoUrl and apiEndpoint are required' }, { status: 400 });
// //   }

// //   try {
// //     // Fetch repository data using the provided API endpoint with Axios
// //     const repoResponse = await axios.get(`${apiEndpoint}?url=${repoUrl}`);
// //     const repoData = repoResponse.data;

// //     // Use the OpenAI API to generate the README based on the repository data
// //     const completion = await openai.chat.completions.create({
// //       model: 'gpt-3.5-turbo',
// //       messages: [
// //         {
// //           role: 'user',
// //           content: `Generate a detailed README based on the following repository data: ${JSON.stringify(repoData)}`,
// //         },
// //       ],
// //     });

// //     if (completion.choices.length) {
// //       return NextResponse.json({ result: completion.choices[0].message.content }, { status: 200 });
// //     } else {
// //       return NextResponse.json({ error: 'No response from OpenAI' }, { status: 500 });
// //     }
// //   } catch (error: any) {
// //     if (error.response) {
// //       console.error('API error:', error.response.data);
// //       return NextResponse.json({ error: error.response.data.error.message }, { status: error.response.status });
// //     } else if (error.request) {
// //       console.error('Network error or no response received:', error.message);
// //       return NextResponse.json({ error: 'No response received from API' }, { status: 500 });
// //     } else {
// //       console.error('Unexpected error:', error.message);
// //       return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
// //     }
// //   }
// // }


// import { NextRequest, NextResponse } from 'next/server';
// import axios from 'axios'; // Importing Axios for HTTP requests
// import OpenAI from 'openai'; // Importing the OpenAI library

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY || '', // Ensure the API key is provided
//   baseURL: process.env.OPENAI_API_BASE || 'https://api.openai.com/v1', // Set the default base URL
// });

// export async function POST(req: NextRequest) {
//   try {
//     // Parse request body
//     const { repoUrl, apiEndpoint } = await req.json();

//     // Basic validation of input data
//     if (!repoUrl || !apiEndpoint) {
//       return NextResponse.json(
//         { error: 'Both repoUrl and apiEndpoint are required' },
//         { status: 400 }
//       );
//     }

//     // Fetch repository data from the provided API endpoint using Axios
//     const repoResponse = await axios.get(`${apiEndpoint}?url=${repoUrl}`);
//     const repoData = repoResponse.data;

//     // Validate that repoData is in the expected format
//     if (!repoData || typeof repoData !== 'object') {
//       return NextResponse.json(
//         { error: 'Invalid repository data received' },
//         { status: 422 }
//       );
//     }

//     // Generate README content using OpenAI's API
//     const completion = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: [
//         {
//           role: 'user',
//           content: `Generate a detailed README based on the following repository data: ${JSON.stringify(repoData)}`,
//         },
//       ],
//     });

//     // Check if the OpenAI response contains valid content
//     if (completion.choices && completion.choices.length > 0) {
//       return NextResponse.json(
//         { result: completion.choices[0].message.content },
//         { status: 200 }
//       );
//     } else {
//       // Handle the case where OpenAI returns an empty response
//       return NextResponse.json(
//         { error: 'No valid response from OpenAI' },
//         { status: 500 }
//       );
//     }
//   } catch (error: any) {
//     // Handle different error scenarios with detailed logging and appropriate responses

//     // Axios error: Handle errors related to HTTP requests
//     if (axios.isAxiosError(error)) {
//       if (error.response) {
//         // Server responded with a status code outside the 2xx range
//         console.error('API response error:', error.response.data);
//         return NextResponse.json(
//           { error: error.response.data.error || 'API request failed' },
//           { status: error.response.status }
//         );
//       } else if (error.request) {
//         // No response received from the server
//         console.error('No response from API:', error.message);
//         return NextResponse.json(
//           { error: 'No response from the API server' },
//           { status: 504 }
//         );
//       }
//     } 

//     // OpenAI error: Handle any issues related to the OpenAI API request
//     if (error.response?.data?.error) {
//       console.error('OpenAI API error:', error.response.data.error.message);
//       return NextResponse.json(
//         { error: error.response.data.error.message },
//         { status: error.response.status }
//       );
//     }

//     // Unexpected errors: Handle any other type of error
//     console.error('Unexpected error:', error.message || 'Unknown error occurred');
//     return NextResponse.json(
//       { error: 'An unexpected error occurred. Please try again later.' },
//       { status: 500 }
//     );
//   }
// }


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

//     if (apiEndpoint) {
//       // Use the user's API endpoint to fetch repository data
//       repoData = await axios.get(apiEndpoint, { params: { repoUrl } });
//     } else {
//       // Fallback: Fetch repository data using an alternative method (e.g., fetching raw data or parsing URL)
//       repoData = await axios.get(`https://api.github.com/repos/${repoUrl}`);
//     }

//     const repoInfo = repoData.data;

//     const completion = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: [
//         {
//           role: 'user',
//           content: `Generate a README for the following repository:\n\n${JSON.stringify(repoInfo)}`,
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
