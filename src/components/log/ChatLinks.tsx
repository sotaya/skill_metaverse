import React from 'react';
import { LogEntry } from '../../Types';
import { AvatarList } from '../graphics/avatar/AvatarList';
import { Sprite, Stage } from '@pixi/react';
import { Rectangle, Texture } from 'pixi.js';
import { TILE_SIZE } from '../graphics/constants/game-world';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './ChatLinks.scss';

interface ChatLinksProps {
  userLog: LogEntry;
  userAvatarId: number;
  userName: string;
  onBack: () => void;
}

const ChatLinks = ({
  userLog,
  userAvatarId,
  userName,
  onBack,
}: ChatLinksProps) => {
  return (
    <div className="chat-links-container">
      <div className="chat-links-header">
        <button className="back-button" onClick={onBack}>
          <ArrowBackIcon />
        </button>
        <h3>共有リンク</h3>
      </div>

      <div className="user-info-header">
        <div className="user-avatar">
          <Stage width={60} height={60} options={{ backgroundAlpha: 0 }}>
            <Sprite
              texture={
                new Texture(
                  Texture.from(AvatarList[userAvatarId]).baseTexture,
                  new Rectangle(0, 64 * 2, 64, 64)
                )
              }
              width={TILE_SIZE * 1.5}
              height={TILE_SIZE * 1.5}
              anchor={0.5}
              x={30}
              y={30}
            />
          </Stage>
        </div>
        <div className="user-info">
          <span className="user-name">{userName}</span>
          <span className="timestamp">[{userLog.timestamp}]</span>
        </div>
      </div>

      <div className="links-content">
        {userLog.sharedLinks && userLog.sharedLinks.length > 0 ? (
          <div className="links-list">
            <h4>共有されたリンク:</h4>
            <ul>
              {userLog.sharedLinks.map((link, index) => (
                <li key={index} className="link-item">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-url"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="no-links">
            <p>No shared links</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLinks;
