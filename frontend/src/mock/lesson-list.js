
  {/*================================================= 
    NOTE: Naka import to sa student-lesson-list .jsx
    ==================================================*/}
const lessonData = [
    {
      id: 1,
      icon: "🌀",
      title: "Introduction to Networking",
      description: "Learn the fundamentals of networking and communication protocols.",
      code: "CCS103",
      topics: [
        { id: 1, title: "Learn the Protocols", status: "Completed" },
        { id: 2, title: "What is LAN?", status: "Unread" },
        { id: 3, title: "Practice, Practice, Practice", status: "Unread" },
        { id: 4, title: "Make a Diagram", status: "Unread" },
      ],
    },
    {
      id: 2,
      icon: "✨",
      title: "Basic Switch and End Device",
      description: "Explore switch configurations and end-device networking.",
      code: "CCS103",
      topics: [
        { id: 1, title: "Switch Configurations", status: "Unread" },
        { id: 2, title: "End-Device Roles", status: "Unread" },
        { id: 3, title: "Practice Scenarios", status: "Unread" },
      ],
    },
  ];
  
  export default lessonData;
  