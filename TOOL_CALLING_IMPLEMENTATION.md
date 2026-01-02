# Tool Calling Implementation for Resume Builder

## Overview
Instead of asking LLM to return JSON, use function calling to let LLM directly call update functions.

---

## Backend Changes (Node.js/Express Example)

### 1. Define Tool Functions Schema

```typescript
// backend/tools/resumeTools.ts

export const resumeTools = [
  {
    type: "function",
    function: {
      name: "update_personal_info",
      description: "Update personal information section (name, email, phone, address, etc.)",
      parameters: {
        type: "object",
        properties: {
          personalInfo: {
            type: "object",
            properties: {
              firstName: { type: "string" },
              lastName: { type: "string" },
              email: { type: "string" },
              phone: { type: "string" },
              address: { type: "string" },
              linkedIn: { type: "string" },
              website: { type: "string" },
            }
          }
        },
        required: ["personalInfo"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "update_experience",
      description: "Add, update, or remove work experience entries",
      parameters: {
        type: "object",
        properties: {
          experience: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                company: { type: "string" },
                position: { type: "string" },
                startDate: { type: "string" },
                endDate: { type: "string" },
                description: { type: "string" },
                location: { type: "string" },
              }
            }
          }
        },
        required: ["experience"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "update_education",
      description: "Add, update, or remove education entries",
      parameters: {
        type: "object",
        properties: {
          education: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                school: { type: "string" },
                degree: { type: "string" },
                field: { type: "string" },
                startDate: { type: "string" },
                endDate: { type: "string" },
                gpa: { type: "string" },
              }
            }
          }
        },
        required: ["education"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "update_skills",
      description: "Update skills section",
      parameters: {
        type: "object",
        properties: {
          skills: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["skills"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "update_projects",
      description: "Add, update, or remove project entries",
      parameters: {
        type: "object",
        properties: {
          projects: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                description: { type: "string" },
                technologies: { type: "array", items: { type: "string" } },
                url: { type: "string" },
              }
            }
          }
        },
        required: ["projects"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "update_summary",
      description: "Update professional summary or objective",
      parameters: {
        type: "object",
        properties: {
          summary: { type: "string" }
        },
        required: ["summary"]
      }
    }
  }
];
```

### 2. Backend API Handler

```typescript
// backend/routes/resumegpt.ts

import OpenAI from "openai";
import { resumeTools } from "../tools/resumeTools";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const handleResumeConversation = async (req, res) => {
  const { userPrompt, resumeId, resumeData, jobDescription } = req.body;

  try {
    // Call OpenAI with tool definitions
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a professional resume assistant. Help users improve their resume. 
          Use the available functions to update resume sections when the user requests changes.`
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      tools: resumeTools,
      tool_choice: "auto" // Let LLM decide when to use tools
    });

    const message = completion.choices[0].message;
    
    // Check if LLM wants to call a function
    if (message.tool_calls && message.tool_calls.length > 0) {
      const toolCalls = message.tool_calls;
      const updates = {};

      // Process each tool call
      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);

        // Map function calls to resume data structure
        switch (functionName) {
          case "update_personal_info":
            updates.personalInfo = functionArgs.personalInfo;
            break;
          case "update_experience":
            updates.experience = functionArgs.experience;
            break;
          case "update_education":
            updates.education = functionArgs.education;
            break;
          case "update_skills":
            updates.skills = functionArgs.skills;
            break;
          case "update_projects":
            updates.projects = functionArgs.projects;
            break;
          case "update_summary":
            updates.summary = functionArgs.summary;
            break;
        }
      }

      // Return both message and updates
      return res.json({
        response: {
          message: message.content || "I've updated your resume.",
          toolCalls: toolCalls,
          updates: updates, // Send updates to frontend
          hasUpdates: true
        }
      });
    } else {
      // No tool calls, just return the message
      return res.json({
        response: {
          message: message.content,
          hasUpdates: false
        }
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
```

---

## Frontend Changes

### 1. Update Chat.tsx to Handle Tool Calls

```typescript
// src/pages/dashboard/resume/resume-detail/Chat.tsx

const handleSend = async () => {
  if (!message.trim()) return;

  setMessages((prev) => [...prev, { role: "user", text: message }]);
  setMessage("");
  setMsgSending(true);

  try {
    const response = await axiosInstance.post(
      `/resumegpt/conversation/${id}`,
      {
        userPrompt: message,
        resumeId: id,
        jobDescription: state.jobDescription,
        resumeData: state.resumeData,
        resumeSettings: state.resumeSettings,
      }
    );

    const responseData = response.data.response;

    // Add LLM message to chat
    setMessages((prev) => [
      ...prev,
      { role: "model", text: responseData.message },
    ]);

    // Handle tool call updates
    if (responseData.hasUpdates && responseData.updates) {
      const updates = responseData.updates;
      
      // Show what's being updated (optional UX enhancement)
      const updatedSections = Object.keys(updates);
      toast.success(`Updated: ${updatedSections.join(", ")}`, {
        position: "top-right",
      });

      // Dispatch updates to context
      dispatch({ 
        type: "UPDATE_RESUME_DATA", 
        payload: updates 
      });

      // Optional: Sync immediately instead of waiting for debounce
      // await syncToBackend(id, updates);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
      });
    }
  } finally {
    setMsgSending(false);
  }
};
```

### 2. Optional: Immediate Sync Function

```typescript
// Add to ResumeContext.tsx or create a separate hook

const syncToBackend = async (
  id: string, 
  updates: Partial<ResumeData>
) => {
  try {
    await axiosInstance.patch(`/resume/${id}`, {
      resumeData: updates
    });
  } catch (error) {
    console.error('Error syncing to backend:', error);
    toast.error('Failed to save changes', { position: "top-right" });
  }
};
```

---

## Comparison: Current vs Tool Calling

### Current Approach
```typescript
// LLM returns:
{
  shouldApplyChanges: true,
  data: { personalInfo: {...}, experience: [...] }
}

// Frontend applies:
dispatch({ type: "UPDATE_RESUME_DATA", payload: data });
```

### Tool Calling Approach
```typescript
// LLM calls functions:
tool_calls: [
  { function: { name: "update_personal_info", arguments: {...} } },
  { function: { name: "update_experience", arguments: {...} } }
]

// Backend processes and returns:
{
  updates: { personalInfo: {...}, experience: [...] }
}

// Frontend applies:
dispatch({ type: "UPDATE_RESUME_DATA", payload: updates });
```

---

## Advantages of Tool Calling

1. **Type Safety**: Function schemas ensure correct data structure
2. **Explicit Intent**: Clear which sections are being updated
3. **Better Error Handling**: Can validate function arguments
4. **Modular**: Easy to add new update functions
5. **LLM Control**: LLM decides when to update vs just respond
6. **Audit Trail**: Can log which functions were called

---

## Migration Path

1. **Phase 1**: Add tool calling alongside current approach (dual mode)
2. **Phase 2**: Test with real users
3. **Phase 3**: Switch to tool calling only
4. **Phase 4**: Remove old JSON response handling

---

## Example User Interactions

**User**: "Update my email to john@example.com"
- **Tool Call**: `update_personal_info({ personalInfo: { email: "john@example.com" } })`

**User**: "Add a new job at Google as Software Engineer"
- **Tool Call**: `update_experience({ experience: [...existing, { company: "Google", position: "Software Engineer", ... }] })`

**User**: "Improve my summary to be more professional"
- **Tool Call**: `update_summary({ summary: "Professional summary text..." })`

---

## Next Steps

1. Define all your resume section update functions
2. Update backend to use OpenAI function calling
3. Update frontend to handle tool call responses
4. Test with various user prompts
5. Add error handling and validation

