import { cleanInput } from "src/repl";
import { getAllBadgeIds, saveUserData } from "../persistence";
import { State } from "../state";
import { User, UserProfile } from "../user.js";
import { capitalize, sanitize } from "src/utilities";

const INTERVIEW_QUESTIONS = [
    { field: "passId", prompt: "Q1: What is your Pass ID?" },
    { field: "dob", prompt: "Q2: What is your Date of Birth? (DD-MM-YYYY)" },
    { field: "gender", prompt: "Q3: What is your Gender?" },

];

export async function interviewHandler(userInput: string, state: State) {
    const input = sanitize(userInput);
    if (!state.interview) {
        state.interview = {
            pendingProfile: { name: input },
            step: 0
        };
        console.log("Welcome! Let's get you registered.");
        console.log(INTERVIEW_QUESTIONS[0].prompt);
        return;
    }

    const interview = state.interview!;
    const currentQ = INTERVIEW_QUESTIONS[interview.step];

    if (currentQ.field === "passId") {
        const existingIds = await getAllBadgeIds();

        if (existingIds.includes(input)) {
            console.log(`The ID '${input}' is already taken! Please choose a unique Badge ID.`);
            console.log(currentQ.prompt);
            return;
        }
    }

    if (currentQ.field === "dob") {
        const datePattern = /^\d{2}-\d{2}-\d{4}$/;

        if (!datePattern.test(userInput.trim())) {
            console.log("Invalid format! Please use DD-MM-YYYY (e.g., 22-05-1997).");
            console.log(currentQ.prompt);
            return;
        }
    }

    if (currentQ.field === "gender") {
        if (input.toLowerCase() != "male" && input.toLocaleLowerCase() != "female") {
            console.log("Please select \"male\" or \"female\"");
            console.log(currentQ.prompt);
            return;
        }
    }

    // dynamic field name to save the input
    (interview.pendingProfile as any)[currentQ.field] = input;


    interview.step++;


    if (interview.step < INTERVIEW_QUESTIONS.length) {
        const nextQ = INTERVIEW_QUESTIONS[interview.step].prompt;
        console.log(nextQ);
        return;
    }

    const newUser = new User(interview.pendingProfile as UserProfile);
    await saveUserData(newUser.profile.name, newUser.userData);

    state.currentUser = newUser;
    state.interview = null;

    console.log(`Profile created! Welcome, ${capitalize(newUser.profile.name)}.`);
}