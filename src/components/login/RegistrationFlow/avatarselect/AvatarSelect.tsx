import React, { useState } from 'react';
import { Stage, Sprite } from '@pixi/react';
import { Rectangle, Texture } from 'pixi.js';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AvatarList } from '../../../graphics/avatar/AvatarList';
import { TILE_SIZE } from '../../../graphics/constants/game-world';
import { auth, db } from '../../../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import './AvatarSelect.scss';

const STAGE_WIDTH = 180;
const STAGE_HEIGHT = 180;
const AvatarSelect = ({ onComplete }: { onComplete: () => void }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleNext = () => {
    setSelectedIndex((prevIndex) => (prevIndex + 1) % AvatarList.length);
  };
  const handlePrev = () => {
    setSelectedIndex(
      (prevIndex) => (prevIndex - 1 + AvatarList.length) % AvatarList.length
    );
  };
  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('ユーザーが認証されていません');
      await setDoc(
        doc(db, 'users', user.uid),
        { avatarId: selectedIndex },
        { merge: true }
      );
      onComplete();
    } catch (err: any) {
      setError(err.message || '通信中にエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="split-container">
        <div className="blue-panel">
          <div className="App-Name">
            <h1>Crosk</h1>
          </div>
          <div className="avatar-select-Title">
            <h1 className="Title1">新規登録</h1>
            <h1 className="Title2">アバター選択</h1>
          </div>
        </div>
        <div className="avatar-select-bg">
          <div className="avatar-select-card">
            <ol className="avatar-select-stepper">
              <li className="step-item ">
                <div className="step-number">1</div>
                <div className="step-label">メール登録</div>
              </li>
              <li className="step-item">
                <div className="step-number">2</div>
                <div className="step-label">プロフィール登録</div>
              </li>
              <li className="step-item is-active">
                <div className="step-number">3</div>
                <div className="step-label">アバター選択</div>
              </li>
            </ol>
            <div className="avatar-select-header">
              <AccountCircleIcon className="header-icon" />
              <h2>アバターを選択</h2>
            </div>
            <div className="avatar-display-area">
              <button
                type="button"
                onClick={handlePrev}
                className="arrow-button"
                disabled={isLoading}
              >
                {'<'}
              </button>
              <Stage
                width={STAGE_WIDTH}
                height={STAGE_HEIGHT}
                options={{ backgroundAlpha: 0 }}
              >
                <Sprite
                  texture={
                    new Texture(
                      Texture.from(AvatarList[selectedIndex]).baseTexture,
                      new Rectangle(0, 64 * 2, 64, 64)
                    )
                  }
                  x={STAGE_WIDTH / 2}
                  y={STAGE_HEIGHT / 2}
                  width={TILE_SIZE * 3}
                  height={TILE_SIZE * 3}
                  anchor={0.5}
                />
              </Stage>
              <button
                type="button"
                onClick={handleNext}
                className="arrow-button"
                disabled={isLoading}
              >
                {'>'}
              </button>
            </div>
            {error && <p className="error-message">{error}</p>}
            <button
              type="button"
              className="main-btn"
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? '登録中...' : '登録完了'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarSelect;
