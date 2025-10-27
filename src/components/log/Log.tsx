import React from 'react';
import { LogEntry } from '../../Types';
import { AvatarList } from '../graphics/avatar/AvatarList';
import { Sprite, Stage } from '@pixi/react';
import { Rectangle, Texture } from 'pixi.js';
import { TILE_SIZE } from '../graphics/constants/game-world';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import './Log.scss';

interface LogProps {
  logs: LogEntry[];
  handleFollow: (targetUserId: string) => void;
  handleUnfollow: (targetUserId: string) => void;
  followingList: string[];
  allPositions?: { [uid: string]: any }; // ユーザー情報を取得するため
  onChatLinksClick?: (
    userLog: LogEntry,
    userAvatarId: number,
    userName: string
  ) => void;
}

const Log = ({
  logs,
  handleFollow,
  handleUnfollow,
  followingList,
  allPositions = {},
  onChatLinksClick,
}: LogProps) => {
  const handleFollowToggle = (targetUserId: string) => {
    if (followingList.includes(targetUserId)) {
      handleUnfollow(targetUserId);
    } else {
      handleFollow(targetUserId);
    }
  };

  const handleChatLinksClick = (log: LogEntry) => {
    if (onChatLinksClick && log.userId) {
      const userAvatarId = getUserAvatarId(log.userId);
      const userName = getUserName(log.userId);
      onChatLinksClick(log, userAvatarId, userName);
    }
  };

  // ユーザーIDからアバターIDを取得する関数
  const getUserAvatarId = (userId: string): number => {
    // --- デバッグここから ---
  console.log("--- getUserAvatarId デバッグ ---");
  console.log("渡された userId:", userId);
  // displayAllPositions は上の関数でも見られるので、不要ならこの行は消しても構いません
  // console.log("検索対象の名簿 (displayAllPositions):", displayAllPositions); 
  // --- デバッグここまで ---
    const userData =
      displayAllPositions[userId as keyof typeof displayAllPositions];
      // --- デバッグここから ---
  console.log("userId で検索した結果 (userData):", userData);
  if (userData === undefined) {
    console.warn(`[デバッグ] 名簿にID "${userId}" が見つかりません。`);
  }
  console.log("--------------------------");
  // --- デバッグここまで ---
    return userData?.avatarId ?? 0;
    // 見つからなかったら0番を返す
  };

  // ユーザーIDからユーザー名を取得する関数
  const getUserName = (userId: string): string => {
    // --- デバッグここから ---
  console.log("--- getUserName デバッグ ---");
  console.log("渡された userId:", userId);
  console.log("検索対象の名簿 (displayAllPositions):", displayAllPositions);
  // --- デバッグここまで ---
    const userData =
      displayAllPositions[userId as keyof typeof displayAllPositions];
      // --- デバッグここから ---
  console.log("userId で検索した結果 (userData):", userData);
  if (userData === undefined) {
    // もし userData が見つからなかったら、警告メッセージを出す
    console.warn(`[デバッグ] 名簿にID "${userId}" が見つかりません。`);
  }
  console.log("--------------------------");
  // --- デバッグここまで ---
    return userData?.userName ?? userId;
    // 見つからなかったらユーザーIDを返す
  };

  // 仮置き用のテストデータ
  const testLogs = [
    {
      id: 'test-1',
      timestamp: '2024-01-15 14:30',
      message: '田中さんとエンカウントしました',
      userId: 'test-user-1',
      userName: '田中太郎',
      sharedLinks: ['https://example.com', 'https://github.com'],
    },
    {
      id: 'test-2',
      timestamp: '2024-01-15 15:45',
      message: '佐藤さんとエンカウントしました',
      userId: 'test-user-2',
      userName: '佐藤花子',
      sharedLinks: [],
    },
    {
      id: 'test-3',
      timestamp: '2024-01-15 16:20',
      message: '山田さんとエンカウントしました',
      userId: 'test-user-3',
      userName: '山田次郎',
      sharedLinks: ['https://reactjs.org'],
    },
    {
      id: 'test-4',
      timestamp: '2024-01-15 13:20',
      message: '室さんとエンカウントしました',
      userId: 'test-user-4',
      userName: '室',
      sharedLinks: ['https://note.com'],
    },
    {
      id: 'test-4',
      timestamp: '2024-01-15 13:20',
      message: '室さんとエンカウントしました',
      userId: 'test-user-4',
      userName: '室',
      sharedLinks: ['https://edge.com'],
    },
  ];

  // 仮置き用のユーザーデータ
  const testAllPositions = {
    'test-user-1': { avatarId: 0, userName: '田中太郎' },
    'test-user-2': { avatarId: 1, userName: '佐藤花子' },
    'test-user-3': { avatarId: 2, userName: '山田次郎' },
    'test-user-4': { avatarId: 3, userName: '室' },
  };

  // 実際のログが空の場合はテストデータを使用
  const displayLogs = logs.length > 0 ? logs : testLogs;
  const displayAllPositions =
    Object.keys(allPositions).length > 0 ? allPositions : testAllPositions;

  // タイムスタンプでソート（最新が上に来るように）
  const sortedLogs = [...displayLogs].sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    return dateB.getTime() - dateA.getTime(); // 降順ソート（新しいものが上）
  });

  return (
    <div className="log-container">
      <h3>エンカウントログ</h3>
      <h4>ここに会話したユーザーの名前が表示されます</h4>
      <div className="log-messages">
        {sortedLogs.map((log) => (
          <div key={log.id} className="log-entry">
            {/* ユーザー情報表示エリア */}
            {log.userId && log.userId !== 'bot' && (
              <div className="user-info-section">
                <div className="user-avatar-row">
                  <div className="user-avatar">
                    <Stage
                      width={60}
                      height={60}
                      options={{ backgroundAlpha: 0 }}
                    >
                      <Sprite
                        texture={
                          new Texture(
                            Texture.from(
                              AvatarList[getUserAvatarId(log.userId)]
                            ).baseTexture,
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
                  <div
                    className="chat-bubble-icon"
                    onClick={() => handleChatLinksClick(log)}
                    style={{ cursor: 'pointer' }}
                  >
                    <ChatBubbleOutlineIcon />
                  </div>
                </div>
                <div className="user-details">
                  <span className="log-timestamp">[{log.timestamp}]</span>
                  <div className="user-name-row">
                    <span className="user-name">{getUserName(log.userId)}</span>
                    <button
                      className="follow-button"
                      onClick={() => handleFollowToggle(log.userId!)}
                    >
                      {followingList.includes(log.userId)
                        ? 'フォロー中'
                        : 'フォロー'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Log;
