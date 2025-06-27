import React from "react";
import "./Log.scss";

//履歴画面
const Log = ({ onClose }: { onClose: () => void }) => (
  <div className="Log">
    <div className="LogHeader">
      <span>エンカウントログ</span>
      <button className="LogClose" onClick={onClose} aria-label="閉じる">
        ✕
      </button>
    </div>
    <div className="LogBody">
      <p>ここにユーザー名とメモ内容が表示されます。</p>
    </div>
  </div>
);

export default Log;
