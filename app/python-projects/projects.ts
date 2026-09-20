export type Status = "complete" | "pending";

// Reuses the placeholder-tile colors already defined in globals.css (.card-hero-placeholder[data-cat]).
export type HeroCategory = "python" | "agent" | "automation" | "web";

export type TrackerProject = {
  number: number;
  slug: string;
  name: string;
  kind: string;
  sections: string;
  category: HeroCategory;
  status: Status;
  description: string;
  problem?: string;
  solution?: string;
  results?: string;
  iteration?: string;
  // Interactive showcase shown in place of the placeholder tile on finished apps.
  demo?: "email" | "weather";
  // Real screenshot shown in place of the colored placeholder tile (used while an app is still pending).
  image?: { src: string; alt: string };
  // Captioned screen recording shown in place of the placeholder tile on a finished app.
  video?: { src: string; alt: string };
  // Short scannable facts shown as tags under the description.
  facts?: string[];
};

// Source of truth: the Python Mega Course: Build 20 Real-World Apps and AI Agents (Udemy, Ardit Sulce).
// App numbers and section ranges follow the course's current curriculum.
export const courseTitle = "Python Mega Course: Build 20 Real-World Apps and AI Agents";

export const projects: TrackerProject[] = [
  {
    number: 1,
    slug: "app-1",
    name: "Task Manager",
    kind: "Desktop GUI + Web",
    sections: "Sections 17–19",
    category: "python",
    status: "pending",
    description:
      "A task manager built first as a desktop GUI, extended with advanced features, then rebuilt as a web app.",
  },
  {
    number: 2,
    slug: "app-2",
    name: "PDF Generator Tool",
    kind: "PDF",
    sections: "Section 21",
    category: "python",
    status: "pending",
    description: "A tool that generates PDF documents programmatically with Python.",
  },
  {
    number: 3,
    slug: "app-3",
    name: "Email News Digest",
    kind: "API + Email",
    sections: "Sections 22–23",
    category: "automation",
    status: "complete",
    demo: "email",
    facts: ["10 stories per email", "English-only, trusted news domains", "Runs daily at 7 AM"],
    description:
      "A Python script that pulls the previous day's AI headlines from NewsAPI, builds an email digest, and sends it to my inbox automatically every morning.",
    problem:
      "Keeping up with a fast-moving topic means checking source after source by hand, every day. Most of that effort is fetching and skimming, which is exactly the kind of work a script can do.",
    solution:
      "The course's Email News App teaches the whole loop behind a daily automated email in Python. **You call a news API with the requests library, read the JSON response, turn the articles into an email body, and send it through Gmail's SMTP server.** That request, parse, deliver pattern sits behind most scheduled reporting, from news digests to pipeline alerts.",
    results:
      "**A working end-to-end script: one run fetches the news, formats it, and delivers it to my inbox with no manual steps.** It's a small project, but every piece (API calls, JSON handling, email delivery) is a building block I reuse in GTM automation.",
    iteration:
      "Two years after starting the course, I came back to this project and partnered with Claude to make it something I would actually read every day. **I filtered the request itself through the URL query string, asking only for English-language articles from a whitelist of trusted news domains, with the date computed fresh on every run, so irrelevant sources stopped showing up.** I rebuilt the email as HTML with a subject line, and a headline, description, image, and link for each story, capped at 10. Then I scheduled it with cron so it lands in my inbox at 7 AM every day. Working through it also sharpened my understanding of how much of an API's behavior you control just by shaping the URL.",
  },
  {
    number: 4,
    slug: "app-4",
    name: "Weather Data API",
    kind: "Flask API",
    sections: "Sections 24–26",
    category: "web",
    status: "complete",
    demo: "weather",
    facts: ["3 ways to ask", "5 weather stations, 1781 to 2022", "Flask + pandas"],
    description:
      "A web service that answers weather questions from real European climate records: the temperature on any day, a whole year at a station, or a station's full history. Built with Flask and pandas.",
    problem:
      "Raw climate data arrives as one text file per weather station, with a metadata header block and temperatures stored in tenths of a degree, so no other program can use it until someone parses it and puts a clean interface on top.",
    solution:
      "Built with Flask and pandas. **A station index at the root, plus endpoints for one station on one date, one station across all dates, and one station for a single year**, each reading the station's file with pandas, skipping the header block, and returning JSON. The single-date lookup also converts the stored tenths-of-a-degree value into degrees Celsius. Data comes from the European Climate Assessment & Dataset (ECA&D) daily mean temperature series.",
    results:
      "**The API runs locally and answers all three query shapes, from a lone daily reading to a full year of records for a station.** The portfolio copy ships a trimmed sample of 5 stations out of the roughly 92-station dataset to keep the repo light, with ECA&D credited and the endpoints documented in the README.",
  },
  {
    number: 5,
    slug: "app-5",
    name: "Weather Forecast Dashboard",
    kind: "Data Dashboard",
    sections: "Sections 27–28",
    category: "python",
    status: "pending",
    image: {
      src: "/project-media/weather-dashboard/weather-forecast-dashboard.png",
      alt: "The Weather Forecast dashboard: a place box set to Tirana, a forecast-days slider set to 2, a data-type dropdown set to Temperature, and a line chart of the temperature for the next 2 days.",
    },
    description:
      "An interactive weather dashboard: data and charts first, then filtering and new features.",
  },
  {
    number: 6,
    slug: "app-6",
    name: "eBook Analyzer",
    kind: "NLP",
    sections: "Sections 29–30",
    category: "python",
    status: "pending",
    description:
      "Extract text from eBooks with Python, then run sentiment analysis with natural language processing.",
  },
  {
    number: 7,
    slug: "app-7",
    name: "Webcam Motion Alert",
    kind: "Computer Vision",
    sections: "Sections 31–32",
    category: "python",
    status: "pending",
    description:
      "Detect motion from a webcam with OpenCV, then add an email alerting system.",
  },
  {
    number: 8,
    slug: "app-8",
    name: "Music Events Scraper",
    kind: "Web Scraping",
    sections: "Sections 33–34",
    category: "automation",
    status: "pending",
    description:
      "Scrape music events from the web: fetch and parse the HTML, then clean and store the data.",
  },
  {
    number: 9,
    slug: "app-9",
    name: "Hotel Booking System",
    kind: "OOP",
    sections: "Sections 36–38",
    category: "python",
    status: "pending",
    description:
      "An object-oriented hotel booking system: classes and reservations, class inheritance and payments, then the different method types.",
  },
  {
    number: 10,
    slug: "app-10",
    name: "Mario Game Code Review",
    kind: "OOP",
    sections: "Section 39",
    category: "python",
    status: "pending",
    description: "A code review of the Mario game, written in an object-oriented style.",
  },
  {
    number: 11,
    slug: "app-11",
    name: "AI News Summarizer",
    kind: "AI Automation",
    sections: "Section 40",
    category: "agent",
    status: "pending",
    description: "An automation that uses AI to summarize the news.",
  },
  {
    number: 12,
    slug: "app-12",
    name: "AI Agent with LangChain",
    kind: "AI Agent",
    sections: "Section 41",
    category: "agent",
    status: "complete",
    video: {
      src: "/project-media/langchain-agent/langchain-todo-agent-demo.mp4",
      alt: "A captioned screen recording of an AI agent managing a Todoist to-do list. Four plain-English requests are typed into the agent on the right, and the to-do list on the left updates after each one: two tasks are added and two are removed.",
    },
    facts: ["Chat in plain English", "Add, show, and remove tasks", "LangChain v1 + Gemini 2.5 Flash"],
    description:
      "An AI agent built in Python with LangChain v1 that manages a real Todoist to-do list. I type a request in plain English, and the agent picks the right tool (add, show, or remove a task) and updates the list.",
  },
  {
    number: 13,
    slug: "app-13",
    name: "Student Management System",
    kind: "GUI + SQLite",
    sections: "Sections 42–44",
    category: "python",
    status: "pending",
    description:
      "A student management system: GUI setup, CRUD operations, then connecting the GUI to a SQLite database.",
  },
  {
    number: 14,
    slug: "app-14",
    name: "Student Database",
    kind: "MySQL",
    sections: "Section 45",
    category: "python",
    status: "pending",
    description: "A student database built on MySQL.",
  },
  {
    number: 15,
    slug: "app-15",
    name: "Web Automation GUI",
    kind: "Selenium",
    sections: "Section 46",
    category: "automation",
    status: "pending",
    description: "Web automation with Selenium, wrapped in a GUI.",
  },
  {
    number: 16,
    slug: "app-16",
    name: "Flask Web App",
    kind: "Flask",
    sections: "Sections 47–48",
    category: "web",
    status: "pending",
    description: "A Flask web app: the frontend first, then the backend.",
  },
  {
    number: 17,
    slug: "app-17",
    name: "Django Web App",
    kind: "Django",
    sections: "Sections 49–51",
    category: "web",
    status: "pending",
    description:
      "A Django web app: setup and models, then forms, database and emailing, then the admin panel and final features.",
  },
  {
    number: 18,
    slug: "app-18",
    name: "Food Ordering App",
    kind: "Django",
    sections: "Sections 52–54",
    category: "web",
    status: "pending",
    description:
      "A Django food ordering app: setup, class-based views and context, then the admin interface and Bootstrap.",
  },
  {
    number: 19,
    slug: "app-19",
    name: "Movie Recommendation System",
    kind: "Machine Learning",
    sections: "Sections 55–56",
    category: "python",
    status: "pending",
    description:
      "Explore the dataset, then dig into the machine learning behind a movie recommendation system.",
  },
  {
    number: 20,
    slug: "app-20",
    name: "Python Package",
    kind: "Packaging",
    sections: "Section 57",
    category: "python",
    status: "pending",
    description: "Build and publish a Python package.",
  },
];
