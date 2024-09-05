// "use client";

// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Loader2, Copy } from "lucide-react";
// import { Toast } from "@/components/ui/toast";

// export default function Hero() {
//   const [repoUrl, setRepoUrl] = useState("");
//   const [githubApiKey, setGithubApiKey] = useState("");
//   const [generatedReadme, setGeneratedReadme] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [showToast, setShowToast] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");
//     setGeneratedReadme("");

//     try {
//       const response = await fetch("/api/generate-readme", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           repoUrl,
//           githubApiKey,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to generate README");
//       }

//       setGeneratedReadme(data.result || "");
//     } catch (err) {
//       if (err instanceof Error) {
//         setError(err.message);
//       } else {
//         setError("An unexpected error occurred.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCopy = () => {
//     navigator.clipboard.writeText(generatedReadme);
//     setShowToast(true);
//     setTimeout(() => setShowToast(false), 3000);
//   };

//   return (
//     <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle className="text-2xl sm:text-3xl text-center">
//             AI README Generator
//           </CardTitle>
//           <CardDescription className="text-center">
//             Generate a README for your GitHub repository using AI
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <Input
//               type="url"
//               placeholder="Enter GitHub repository URL"
//               value={repoUrl}
//               onChange={(e) => setRepoUrl(e.target.value)}
//               required
//             />
//             <Input
//               type="password"
//               placeholder="Enter GitHub API Key"
//               value={githubApiKey}
//               onChange={(e) => setGithubApiKey(e.target.value)}
//               required
//             />
//             <Button type="submit" className="w-full" disabled={isLoading}>
//               {isLoading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Generating...
//                 </>
//               ) : (
//                 "Generate README"
//               )}
//             </Button>
//           </form>
//         </CardContent>
//         <CardFooter className="flex flex-col items-start">
//           {error && (
//             <Alert variant="destructive" className="mb-4 w-full">
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}
//           {generatedReadme && (
//             <div className="w-full relative">
//               <h2 className="text-lg font-semibold mb-2">Generated README:</h2>
//               <div className="relative">
//                 <pre className="bg-secondary p-4 rounded-md overflow-x-auto text-sm whitespace-pre-wrap break-words">
//                   {generatedReadme}
//                 </pre>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="absolute top-2 right-2"
//                   onClick={handleCopy}
//                 >
//                   <Copy className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           )}
//         </CardFooter>
//       </Card>
//       {showToast && <Toast title="Copied to Clipboard" description={""} />}
//     </div>
//   );
// }

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Copy, Eye, EyeOff } from "lucide-react";
import { Toast } from "@/components/ui/toast";
import ReactMarkdown from "react-markdown";
import { useMediaQuery } from "react-responsive";

export default function Hero() {
  const [repoUrl, setRepoUrl] = useState("");
  const [githubApiKey, setGithubApiKey] = useState("");
  const [showGithubApiKey, setShowGithubApiKey] = useState(false);
  const [generatedReadme, setGeneratedReadme] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Responsive handling
  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setGeneratedReadme("");

    try {
      const response = await fetch("/api/generate-readme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repoUrl,
          githubApiKey,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Invalid GitHub API Key.");
        } else if (response.status === 404) {
          throw new Error("Repository not found.");
        } else {
          throw new Error(data.error || "An error occurred.");
        }
      }

      setGeneratedReadme(data.result || "");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unexpected error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReadme);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const toggleGithubApiKey = () => {
    setShowGithubApiKey(!showGithubApiKey);
  };

  return (
    <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
      <Card className={`w-full ${isMobile ? "max-w-xs" : "max-w-2xl"} mx-auto`}>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl text-center">
            AI README Generator
          </CardTitle>
          <CardDescription className="text-center">
            Generate a README for your GitHub repository using AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="url"
              placeholder="Enter GitHub repository URL"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              required
            />
            <div className="relative">
              <Input
                type={showGithubApiKey ? "text" : "password"}
                placeholder="Enter GitHub API Key"
                value={githubApiKey}
                onChange={(e) => setGithubApiKey(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white"
                onClick={toggleGithubApiKey}
              >
                {showGithubApiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate README"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          {error && (
            <Alert variant="destructive" className="mb-4 w-full">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {generatedReadme && (
            <div className="w-full relative">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Generated README:</h2>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={handleCopy}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={togglePreview}>
                    {showPreview ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="relative">
                {!showPreview ? (
                  <pre className="bg-secondary p-4 rounded-md overflow-x-auto text-sm whitespace-pre-wrap break-words">
                    {generatedReadme}
                  </pre>
                ) : (
                  <ReactMarkdown className="prose prose-sm sm:prose-lg">
                    {generatedReadme}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
      {showToast && <Toast title="Copied to Clipboard" description={""} />}
    </div>
  );
}
