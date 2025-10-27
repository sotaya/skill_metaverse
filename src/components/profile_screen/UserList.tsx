import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { AvatarList } from "../graphics/avatar/AvatarList";
import { Sprite, Stage } from "@pixi/react";
import { Rectangle, Texture } from "pixi.js";
import "./UserList.scss";

interface UserListProps {
  title: string;
  userIds: string[];
  onUserClick: (uid: string) => void;
}

const UserList: React.FC<UserListProps> = ({ title, userIds, onUserClick }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const userPromises = userIds.map((uid) => getDoc(doc(db, "users", uid)));
      const userDocs = await Promise.all(userPromises);
      const usersData = userDocs
        .filter((doc) => doc.exists())
        .map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
      setLoading(false);
    };

    fetchUsers();
  }, [userIds]);

  if (loading) {
    return <div className="user-list-loading">読み込み中...</div>;
  }

  return (
    <div className="user-list-container">
      <h3>{title}</h3>
      {users.length === 0 ? (
        <p>まだユーザーがいません</p>
      ) : (
        <ul className="user-list">
          {users.map((user) => (
            <li key={user.id} onClick={() => onUserClick(user.id)}>
              <div className="user-list-avatar">
                <Stage width={40} height={40} options={{ backgroundAlpha: 0 }}>
                  <Sprite
                    texture={
                      new Texture(
                        Texture.from(
                          AvatarList[user.avatarId || 0]
                        ).baseTexture,
                        new Rectangle(0, 64 * 2, 64, 64)
                      )
                    }
                    x={20}
                    y={20}
                    width={32}
                    height={32}
                    anchor={0.5}
                  />
                </Stage>
              </div>
              <span>{user.userName}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;
