import { useDispatch, useSelector } from "react-redux";
import { Activity } from "../contracts/activity/Activity";
import { Fact } from "../contracts/fact/Fact";
import { Learning } from "../contracts/learning/Learning";
import { Work } from "../contracts/work/Work";
import { RootState, useAppDispatch } from "../store/createStore";
import {
    createActivity,
    createFact,
    createLearning,
    createWork,
    editActivity,
    editFact,
    editLearning,
    editUser,
    editWork,
    IUserState,
    removeActivity,
    removeAvatar,
    removeFact,
    removeLearning,
    removeWork,
    setActivity,
    setFact,
    setLearning,
    setWork,
    subscribe,
    unSubscribe,
    updateUser
} from "../store/user";

interface IUserStore extends IUserState {
    updateUser: (userId: any) => Promise<void>
    editUser: (fieldName: string, value: any) => Promise<void>
    removeAvatar: () => Promise<void>

    subscribe: () => Promise<void>
    unSubscribe: () => Promise<void>

    setLearning: (learning: Learning) => Promise<void>
    createLearning: () => Promise<void>
    editLearning: () => Promise<void>
    removeLearning: () => Promise<void>

    setWork: (work: Work) => Promise<void>
    createWork: () => Promise<void>
    editWork: () => Promise<void>
    removeWork: () => Promise<void>

    setActivity: (activity: Activity) => Promise<void>
    createActivity: () => Promise<void>
    editActivity: () => Promise<void>
    removeActivity: () => Promise<void>

    setFact: (fact: Fact) => Promise<void>
    createFact: () => Promise<void>
    editFact: () => Promise<void>
    removeFact: () => Promise<void>
}

function useUserStore(): IUserStore {
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();

    return {
        ...user,
        updateUser: async (userId) => { await dispatch(updateUser(userId)); },
        editUser: async (fieldName, value) => { await dispatch(editUser(fieldName, value)); },
        removeAvatar: async () => { await dispatch(removeAvatar()); },

        subscribe: async () => { await dispatch(subscribe()); },
        unSubscribe: async () => { await dispatch(unSubscribe()); },

        setLearning: async (learning) => { await dispatch(setLearning(learning)); },
        createLearning: async () => { await dispatch(createLearning()); },
        editLearning: async () => { await dispatch(editLearning()); },
        removeLearning: async () => { await dispatch(removeLearning()); },

        setWork: async (work) => { await dispatch(setWork(work)); },
        createWork: async () => { await dispatch(createWork()); },
        editWork: async () => { await dispatch(editWork()); },
        removeWork: async () => { await dispatch(removeWork()); },

        setActivity: async (activity) => { await dispatch(setActivity(activity)); },
        createActivity: async () => { await dispatch(createActivity()); },
        editActivity: async () => { await dispatch(editActivity()); },
        removeActivity: async () => { await dispatch(removeActivity()); },

        setFact: async (fact) => { await dispatch(setFact(fact)); },
        createFact: async () => { await dispatch(createFact()); },
        editFact: async () => { await dispatch(editFact()); },
        removeFact: async () => { await dispatch(removeFact()); },
    };
} 

export default useUserStore;