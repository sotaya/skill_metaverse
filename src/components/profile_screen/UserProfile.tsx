import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { AvatarList } from '../graphics/avatar/AvatarList';
import { TILE_SIZE } from '../graphics/constants/game-world';
import { Stage, Sprite } from '@pixi/react';
import { Rectangle, Texture } from 'pixi.js';
import './UserProfile.scss';

interface UserProfileProps {
  userId: string;
  onBack: () => void;
}

const STAGE_WIDTH = 120;
const STAGE_HEIGHT = 120;

const UserProfile = ({ userId, onBack }: UserProfileProps) => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
      setLoading(false);
    };
    fetchUserData();
  }, [userId]);

  if (loading) {
    return <p className="user-profile-loading">読み込み中...</p>;
  }

  if (!userData) {
    return (
      <div className="user-profile-loading">
        <p>ユーザーが見つかりません。</p>
      </div>
    );
  }

  return (
    <div className="profile-main-content">
      <div className="profile-header">
        <Stage
          width={STAGE_WIDTH}
          height={STAGE_HEIGHT}
          options={{ backgroundAlpha: 0 }}
        >
          <Sprite
            texture={
              new Texture(
                Texture.from(AvatarList[userData.avatarId || 0]).baseTexture,
                new Rectangle(0, 64 * 2, 64, 64)
              )
            }
            x={STAGE_WIDTH / 2}
            y={STAGE_HEIGHT / 2}
            width={TILE_SIZE * 2.5}
            height={TILE_SIZE * 2.5}
            anchor={0.5}
          />
        </Stage>
        <div className="profile-info">
          <h2>{userData.userName}</h2>
          <p className="profile-status">{userData.status}</p>
        </div>
      </div>
      <div className="profile-body">
        <div className="profile-follow-stats">
          <button className="follow-stat-button">
            <strong>{userData.following?.length || 0}</strong>
            <span>フォロー中</span>
          </button>
          <button className="follow-stat-button">
            <strong>{userData.followers?.length || 0}</strong>
            <span>フォロワー</span>
          </button>
        </div>
        <div className="profile-section">
          <h3>自己紹介</h3>
          <p>{userData.content || '自己紹介が設定されていません。'}</p>
        </div>
        <div className="profile-section">
          <h3>スキル</h3>
          <div className="profile-skills">
            {userData.skills?.length > 0 ? (
              userData.skills.map((skill: string) => (
                <span key={skill} className="skill-tag">
                  {skill}
                </span>
              ))
            ) : (
              <p>スキルが設定されていません。</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
