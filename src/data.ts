
// CONTENT FILE. YouTube lessons stream online. MP4 videos can be stored in public/videos.
export type Phrase = { id: string; en: string; sw: string; cat: string; desc: string; video?: string }

export const phraseCats = ['Medical','Emergencies','Questions','Greetings','Education','Daily communication','Family','Transportation']

// Kiswahili lines are drafts: have a Kiswahili speaker review them.
export const phrases: Phrase[] = [
  { id:'p1', en:'I need help.', sw:'Ninahitaji msaada.', cat:'Emergencies', desc:'Used to ask for urgent assistance.' },
  { id:'p2', en:'Help is on the way.', sw:'Msaada unakuja.', cat:'Emergencies', desc:'Reassures someone that help is coming.' },
  { id:'p3', en:'Are you feeling dizzy?', sw:'Unahisi kizunguzungu?', cat:'Medical', desc:'A health-check question.' },
  { id:'p4', en:'Do you have any allergies?', sw:'Una mzio wowote?', cat:'Medical', desc:'Asked before treatment or food.' },
  { id:'p5', en:'Please sit down here.', sw:'Tafadhali kaa hapa.', cat:'Daily communication', desc:'A polite request to take a seat.' },
  { id:'p6', en:'What is your name?', sw:'Jina lako nani?', cat:'Questions', desc:'Asking for someone’s name.' },
  { id:'p7', en:'My name is...', sw:'Jina langu ni...', cat:'Greetings', desc:'Introducing yourself.' },
  { id:'p8', en:'Where are you going?', sw:'Unaenda wapi?', cat:'Transportation', desc:'Asking about someone’s destination.' },
  { id:'p9', en:'I need water.', sw:'Ninahitaji maji.', cat:'Daily communication', desc:'Asking for drinking water.' },
  { id:'p10', en:'Thank you.', sw:'Asante.', cat:'Greetings', desc:'Expressing thanks.' },
]

export type Lesson = {
  id: string;
  title: string;
  explain: string;
  objectives: string[];
  practice: string;
  video?: string;
  videoType?: 'youtube' | 'mp4';
}

export type Module = { id: string; name: string; lessons: Lesson[] }

const topics = ['Alphabet','Numbers','Greetings','Introductions','Family','Education','Healthcare','Emergencies','Food and daily needs','Transportation','Work and business','Common conversations']

const mk = (code: string): Lesson[] => topics.map((t, i) => ({
  id: `${code}-${i}`,
  title: t,
  explain: 'Lesson text has not been written yet. It must be written with Deaf KSL users and trainers.',
  objectives: [`Recognise and use basic signs for: ${t.toLowerCase()}`],
  practice: 'Practice activity to be added once verified signs are available.',
}))

const kslLessons = mk('ksl')

// Temporary educational videos from Action for Children with Disabilities (ACD).
// These are external YouTube videos, not Pamoja Sign original content.
kslLessons[2] = {
  id: 'ksl-2',
  title: 'Greetings and Responses',
  explain: 'A temporary Kenyan Sign Language learning video from Action for Children with Disabilities (ACD).',
  objectives: ['Watch the demonstration and observe the signs.'],
  practice: 'Watch the lesson and practise the signs demonstrated.',
  video: 'kqJV2gUizl4',
  videoType: 'youtube',
}

kslLessons[3] = {
  id: 'ksl-3',
  title: 'Colours',
  explain: 'A temporary Kenyan Sign Language learning video from Action for Children with Disabilities (ACD).',
  objectives: ['Watch the demonstration and observe the signs.'],
  practice: 'Watch the lesson and practise the signs demonstrated.',
  video: '_TwtFZTxgHQ',
  videoType: 'youtube',
}

kslLessons[4] = {
  id: 'ksl-4',
  title: 'Parts of the Body',
  explain: 'A temporary Kenyan Sign Language learning video from Action for Children with Disabilities (ACD).',
  objectives: ['Watch the demonstration and observe the signs.'],
  practice: 'Watch the lesson and practise the signs demonstrated.',
  video: 'V-_z21PLqvo',
  videoType: 'youtube',
}

// Each sign language is its own module.
export const modules: Module[] = [
  { id:'ksl', name:'Kenyan Sign Language (KSL)', lessons: kslLessons }
]