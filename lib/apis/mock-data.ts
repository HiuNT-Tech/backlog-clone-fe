export const mockData = {
  board: {
    id: 1,
    title: 'TrungQuanDev MERN Stack Board',
    description: 'Pro MERN stack Course',
    type: 'PUBLIC',
    members: [],
    columns: [
      {
        id: 1,
        boardId: 1,
        title: 'To Do Column 01',
        position: 0,
        cards: Array.from({ length: 11 }, (_, index) => {
          const id = index + 2;

          return {
            id,
            boardId: 1,
            columnId: 1,
            position: index,
            title: `Title of card ${String(id).padStart(2, '0')}`,
            description: null,
            cover: null,
            memberIds: [],
            comments: [],
            attachments: [],
          };
        }),
      },
      {
        id: 3,
        boardId: 1,
        title: 'Done Column 03',
        position: 1,
        cards: Array.from({ length: 5 }, (_, index) => {
          const id = index + 13;

          return {
            id,
            boardId: 1,
            columnId: 3,
            position: index,
            title: `Title of card ${id}`,
            description: null,
            cover: null,
            memberIds: [],
            comments: [],
            attachments: [],
          };
        }),
      },
      {
        id: 4,
        boardId: 1,
        title: 'Empty Column 04',
        position: 2,
        cards: [
          {
            id: -4,
            boardId: 1,
            columnId: 4,
            position: 0,
            FE_PlaceholderCard: true,
          },
        ],
      },
    ],
  },
};
