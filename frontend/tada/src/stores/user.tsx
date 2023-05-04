const ENTER_ROOM = 'user/ENTER_ROOM' as const;
const ENTER_NICKNAME = 'user/ENTER_NICKNAME' as const;
const ENTER_CHARACTER = 'user/ENTER_CHARACTER ' as const;

export const enterRoom = (roomNumber: number) => ({
	type: ENTER_ROOM,
	payload: roomNumber,
});
export const enterNickname = (nickname: string) => ({
	type: ENTER_NICKNAME,
	payload: nickname,
});
export const enterCharacter = (character: number) => ({
	type: ENTER_CHARACTER,
	payload: character,
});

type UserAction =
	| ReturnType<typeof enterRoom>
	| ReturnType<typeof enterNickname>
	| ReturnType<typeof enterCharacter>;

type UserState = {
	nickname: string;
	character: number;
	roomNumber: number;
};

const initialState: UserState = {
	nickname: '',
	character: 0,
	roomNumber: 0,
};

function user(state: UserState = initialState, action: UserAction): UserState {
	switch (action.type) {
	case ENTER_ROOM:
		return {
			...state,
			roomNumber: action.payload,
		};
	case ENTER_NICKNAME:
		return {
			...state,
			nickname: action.payload,
		};
	case ENTER_CHARACTER:
		return {
			...state,
			character: action.payload,
		};
	default: return state;
	}
}

export default user;
