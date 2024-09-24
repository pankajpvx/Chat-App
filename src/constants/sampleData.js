export const sampleChats = [
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "john doe",
    _id: "1",
    groupChat: "false",
    members: ["1", "2"],
  },
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "Pankaj",
    _id: "2",
    groupChat: "false",
    members: ["1", "2"],
  },
];

export const sampleUsers = [
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "john doe",
    _id: "1",
  },
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "johnny",
    _id: "2",
  },
];

export const sampleNotifiactions = [
  {
    sender: {
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      name: "john doe",
    },
    _id: "1",
  },
  {
    sender: {
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      name: "johnny",
    },
    _id: "2",
  },
];

export const sampleMessage = [
  {
    attachments: [
      {
        public_id: "alsjjdn",
        url: "https://www.w3schools.com/howto/img_avatar.png",
      },
    ],

    // content: "lonasdinainssjdnakjs",
    _id: "asdad",
    sender: {
      _id: "user._id",
      name: "chaman",
    },
    chat: "chatId",
    createdAt: "2024-07-30T06:51:30.799Z",
  },
  {
    attachments: [
      // {
      //   public_id: "alsjjdn2",
      //   url: "https://www.w3schools.com/howto/img_avatar.png",
      // },
    ],

    content: "kajsbdaksjdnakjsd",
    _id: "asdad2",
    sender: {
      _id: "12",
      name: "chaman",
    },
    chat: "chatId",
    createdAt: "2024-07-30T06:51:30.799Z",
  },
];

export const dashboardData = {
  users: [
    {
      _id: "1",
      name: "Pankaj",
      avatar: "https://www.w3schools.com/howto/img_avatar.png",
      username: "pankaj",
      friends: 20,
      groups: 5,
    },
    {
      _id: "2",
      name: "Pankaj",
      avatar: "https://www.w3schools.com/howto/img_avatar.png",
      username: "pankaj",
      friends: 25,
      groups: 10,
    },
  ],
  chats: [
    {
      _id: "1",
      name: "yo yo",
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      groupChat: false,
      members: [
        { _id: "1", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
        { _id: "2", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
      ],
      totalMembers: 2,
      totalMessages: 20,
      creator: {
        name: "pankaj",
        avatar: "https://www.w3schools.com/howto/img_avatar.png",
      },
    },
    {
      _id: "2",
      name: "BEst",
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      groupChat: false,
      members: [
        { _id: "1", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
        { _id: "2", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
      ],
      totalMembers: 3,
      totalMessages: 12,
      creator: {
        name: "john doe",
        avatar: "https://www.w3schools.com/howto/img_avatar.png",
      },
    },
  ],

  messages: [
    {
      attachments: [
        {
          public_id: "alsjjdn",
          url: "https://www.w3schools.com/howto/img_avatar.png",
        },
      ],
      content: "asdafsasdsaa",
      _id: "23",
      sender: {
        _id: "424",
        name: "chaman",
        avatar: "https://www.w3schools.com/howto/img_avatar.png",
      },
      chat: "chatId",
      groupChat: false,
      createdAt: "2024-07-30T06:51:30.799Z",
    },
    {
      attachments: [],
      content: "asdafsasdsaaasd",
      _id: "22",
      sender: {
        _id: "421",
        avatar: "https://www.w3schools.com/howto/img_avatar.png",
        name: "pankaj",
      },
      groupChat: true,
      chat: "chatId",
      createdAt: "2024-07-30T06:51:30.799Z",
    },
  ],
};
