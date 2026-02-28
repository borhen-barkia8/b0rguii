import { TaskType } from './store';

export interface VerificationMethod {
  description: string;
  successCriteria: string;
  randomRequirement: string;
}

export const VerificationMethods: Record<TaskType, VerificationMethod> = {
  Study: {
    description: "Intense cognitive absorption session.",
    successCriteria: "Show your study materials (books, notes, screen).",
    randomRequirement: "Hold a pen between your teeth."
  },
  Sport: {
    description: "Physical optimization routine.",
    successCriteria: "Show your workout gear or sweat.",
    randomRequirement: "Give a thumbs up with your non-dominant hand."
  },
  Socialize: {
    description: "Human interaction simulation.",
    successCriteria: "Show yourself with another human unit.",
    randomRequirement: "Both units must make a peace sign."
  },
  Dishes: {
    description: "Sanitation of feeding implements.",
    successCriteria: "Show a clean sink and drying rack.",
    randomRequirement: "Hold a clean plate like a steering wheel."
  },
  Reading: {
    description: "Analog data ingestion.",
    successCriteria: "Show the book you are currently processing.",
    randomRequirement: "Cover one eye with the book."
  },
  'Healthy Eating': {
    description: "Nutritional fuel intake.",
    successCriteria: "Show your unprocessed organic fuel.",
    randomRequirement: "Balance a piece of fruit on your shoulder."
  },
  Hydrate: {
    description: "H2O level maintenance.",
    successCriteria: "Show a full or recently emptied water container.",
    randomRequirement: "Point at the container with both index fingers."
  },
  'Wake Up': {
    description: "System boot sequence completion.",
    successCriteria: "Show yourself out of the sleep pod.",
    randomRequirement: "Make a 'V' sign with your fingers over your eyes."
  },
  Coding: {
    description: "Logic structure assembly.",
    successCriteria: "Show your IDE with active code.",
    randomRequirement: "Rest your chin on your palm while looking at the screen."
  },
  Outdoors: {
    description: "Atmospheric exposure session.",
    successCriteria: "Show natural light and vegetation.",
    randomRequirement: "Touch a leaf or blade of grass."
  }
};
