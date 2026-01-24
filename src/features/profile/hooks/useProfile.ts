import { useState, useEffect } from "react";

import { UserProfile } from "../../../types/user";

const DEFAULT_USER = {
    name: "张同学",
    avatar: "",
    role: "机械工程专业学生",
};

export const useProfile = (
    user: UserProfile = DEFAULT_USER,
    onUpdateProfile: (
        name: string,
        role: string,
        avatar: string,
    ) => void = () => {},
) => {
    const [name, setName] = useState(user.name);
    const [role, setRole] = useState(user.role);
    const [avatar, setAvatar] = useState(user.avatar);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setName(user.name);
        setRole(user.role);
        setAvatar(user.avatar);
    }, [user]);

    const handleSave = () => {
        onUpdateProfile(name, role, avatar);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setName(user.name);
        setRole(user.role);
        setAvatar(user.avatar);
        setIsEditing(false);
    };

    return {
        name,
        setName,
        role,
        setRole,
        avatar,
        setAvatar,
        isEditing,
        setIsEditing,
        handleSave,
        handleCancel,
    };
};
