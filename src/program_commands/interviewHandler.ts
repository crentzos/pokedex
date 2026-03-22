import { saveUserData } from "src/persistence";
import { State } from "src/state";
import { User, UserProfile } from "src/user";

const INTERVIEW_QUESTIONS = [
    { field: "passId", prompt: "Q1: What is your Pass ID?" },
    { field: "dob", prompt: "Q1: What is your Date of Birth? (DD-MM-YYYY)" },
    { field: "gender", prompt: "Q3: What is your Gender?" },

];

export async function interviewHandler(input: string, state: State) {
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

    console.log(`Profile created! Welcome, ${newUser.profile.name}.`);
}