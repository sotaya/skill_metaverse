import React from "react";
import "./LicenseInfo.scss";

interface LicenseInfoProps {
  onBack: () => void;
}

interface SimpleCredit {
  type: "simple";
  name: string;
  license: string;
  licenseUrl: string;
}

interface DetailedCredit {
  type: "detailed";
  name: string;
  author: string;
  authorUrl: string;
  sourceName: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
}

interface AvatarCredit {
  type: "avatar";
  name: string;
  licenses: { name: string; url: string }[];
  authors: string[];
  links: string[];
}

type CreditItem = SimpleCredit | DetailedCredit | AvatarCredit;

// クレジット情報データ
const lpcCredits = {
  avatar1: {
    type: "avatar" as const,
    name: "アバター1",
    licenses: [
      {
        name: "OGA-BY 3.0",
        url: "https://static.opengameart.org/OGA-BY-3.0.txt",
      },
      {
        name: "CC-BY-SA 3.0",
        url: "https://creativecommons.org/licenses/by-sa/3.0/",
      },
      { name: "GPL 3.0", url: "https://www.gnu.org/licenses/gpl-3.0.en.html" },
      { name: "CC0", url: "http://creativecommons.org/publicdomain/zero/1.0/" },
    ],
    authors: [
      "bluecarrot16",
      "JaidynReiman",
      "Benjamin K. Smith (BenCreating)",
      "Evert",
      "Eliza Wyatt (ElizaWy)",
      "TheraHedwig",
      "MuffinElZangano",
      "Durrani",
      "Johannes Sjölund (wulax)",
      "Stephen Challener (Redshrike)",
      "Fabzy",
    ],
    links: [
      "https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles",
      "https://opengameart.org/content/lpc-medieval-fantasy-character-sprites",
      "https://github.com/ElizaWy/LPC",
      "https://opengameart.org/content/the-revolution-hair",
      "https://opengameart.org/content/lpc-jewelry",
      "https://opengameart.org/content/lpc-expanded-pants",
    ],
  },
  avatar2: {
    type: "avatar" as const,
    name: "アバター2",
    licenses: [
      {
        name: "OGA-BY 3.0",
        url: "https://static.opengameart.org/OGA-BY-3.0.txt",
      },
      {
        name: "CC-BY-SA 3.0",
        url: "https://creativecommons.org/licenses/by-sa/3.0/",
      },
      { name: "GPL 3.0", url: "https://www.gnu.org/licenses/gpl-3.0.en.html" },
      {
        name: "GPL 2.0",
        url: "https://www.gnu.org/licenses/old-licenses/gpl-2.0.html",
      },
      {
        name: "CC-BY 3.0+",
        url: "https://creativecommons.org/licenses/by/3.0/",
      },
    ],
    authors: [
      "bluecarrot16",
      "JaidynReiman",
      "Benjamin K. Smith (BenCreating)",
      "Evert",
      "Eliza Wyatt (ElizaWy)",
      "TheraHedwig",
      "MuffinElZangano",
      "Durrani",
      "Johannes Sjölund (wulax)",
      "Stephen Challener (Redshrike)",
      "Matthew Krohn (makrohn)",
      "Mandi Paugh",
      "William.Thompsonj",
    ],
    links: [
      "https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles",
      "https://opengameart.org/content/lpc-medieval-fantasy-character-sprites",
      "https://github.com/ElizaWy/LPC",
      "http://opengameart.org/content/lpc-clothing-updates",
      "https://opengameart.org/content/lpc-expanded-pants",
      "http://opengameart.org/content/sara-wizard",
      "https://opengameart.org/content/lpc-expanded-socks-shoes",
    ],
  },
  avatar3: {
    type: "avatar" as const,
    name: "アバター3",
    licenses: [
      {
        name: "OGA-BY 3.0",
        url: "https://static.opengameart.org/OGA-BY-3.0.txt",
      },
      {
        name: "CC-BY-SA 3.0",
        url: "https://creativecommons.org/licenses/by-sa/3.0/",
      },
      { name: "GPL 3.0", url: "https://www.gnu.org/licenses/gpl-3.0.en.html" },
    ],
    authors: [
      "bluecarrot16",
      "JaidynReiman",
      "Benjamin K. Smith (BenCreating)",
      "Evert",
      "Eliza Wyatt (ElizaWy)",
      "TheraHedwig",
      "MuffinElZangano",
      "Durrani",
      "Johannes Sjölund (wulax)",
      "Stephen Challener (Redshrike)",
      "Manuel Riecke (MrBeast)",
      "Joe White",
      "Thane Brimhall (pennomi)",
      "laetissima",
    ],
    links: [
      "https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles",
      "https://opengameart.org/content/lpc-medieval-fantasy-character-sprites",
      "https://opengameart.org/content/lpc-expanded-hair",
      "https://opengameart.org/content/lpc-gentleman",
      "http://opengameart.org/content/lpc-clothing-updates",
      "https://opengameart.org/content/lpc-expanded-pants",
      "https://opengameart.org/content/lpc-expanded-socks-shoes",
    ],
  },
  avatar4: {
    type: "avatar" as const,
    name: "アバター4",
    licenses: [
      {
        name: "OGA-BY 3.0",
        url: "https://static.opengameart.org/OGA-BY-3.0.txt",
      },
      {
        name: "CC-BY-SA 3.0",
        url: "https://creativecommons.org/licenses/by-sa/3.0/",
      },
      { name: "GPL 3.0", url: "https://www.gnu.org/licenses/gpl-3.0.en.html" },
      { name: "CC0", url: "http://creativecommons.org/publicdomain/zero/1.0/" },
    ],
    authors: [
      "Benjamin K. Smith (BenCreating)",
      "bluecarrot16",
      "TheraHedwig",
      "Evert",
      "MuffinElZangano",
      "Durrani",
      "Pierre Vigier (pvigier)",
      "ElizaWy",
      "Matthew Krohn (makrohn)",
      "Johannes Sjölund (wulax)",
      "Stephen Challener (Redshrike)",
      "Lanea Zimmerman (Sharm)",
      "JaidynReiman",
      "Joe White",
    ],
    links: [
      "https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles",
      "https://opengameart.org/content/lpc-medieval-fantasy-character-sprites",
      "https://opengameart.org/content/lpc-hair",
      "https://opengameart.org/content/lpc-7-womens-shirts",
      "http://opengameart.org/content/lpc-clothing-updates",
      "https://opengameart.org/content/lpc-expanded-socks-shoes",
    ],
  },
  avatar5: {
    type: "avatar" as const,
    name: "アバター5",
    licenses: [
      {
        name: "OGA-BY 3.0",
        url: "https://static.opengameart.org/OGA-BY-3.0.txt",
      },
      {
        name: "CC-BY-SA 3.0",
        url: "https://creativecommons.org/licenses/by-sa/3.0/",
      },
      { name: "GPL 3.0", url: "https://www.gnu.org/licenses/gpl-3.0.en.html" },
      {
        name: "GPL 2.0",
        url: "https://www.gnu.org/licenses/old-licenses/gpl-2.0.html",
      },
      { name: "CC0", url: "http://creativecommons.org/publicdomain/zero/1.0/" },
    ],
    authors: [
      "Benjamin K. Smith (BenCreating)",
      "bluecarrot16",
      "TheraHedwig",
      "Evert",
      "MuffinElZangano",
      "Durrani",
      "Pierre Vigier (pvigier)",
      "ElizaWy",
      "Matthew Krohn (makrohn)",
      "Johannes Sjölund (wulax)",
      "Stephen Challener (Redshrike)",
      "Lanea Zimmerman (Sharm)",
      "Nila122",
      "JaidynReiman",
    ],
    links: [
      "https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles",
      "https://opengameart.org/content/lpc-medieval-fantasy-character-sprites",
      "https://opengameart.org/content/lpc-hair",
      "https://opengameart.org/content/lpc-jewelry",
      "https://opengameart.org/content/lpc-7-womens-shirts",
      "https://opengameart.org/content/lpc-expanded-pants",
      "https://opengameart.org/content/lpc-expanded-socks-shoes",
    ],
  },
  avatar6: {
    type: "avatar" as const,
    name: "アバター6",
    licenses: [
      {
        name: "OGA-BY 3.0",
        url: "https://static.opengameart.org/OGA-BY-3.0.txt",
      },
      {
        name: "CC-BY-SA 3.0",
        url: "https://creativecommons.org/licenses/by-sa/3.0/",
      },
      { name: "GPL 3.0", url: "https://www.gnu.org/licenses/gpl-3.0.en.html" },
      { name: "CC0", url: "http://creativecommons.org/publicdomain/zero/1.0/" },
    ],
    authors: [
      "Benjamin K. Smith (BenCreating)",
      "bluecarrot16",
      "TheraHedwig",
      "Evert",
      "MuffinElZangano",
      "Durrani",
      "Pierre Vigier (pvigier)",
      "ElizaWy",
      "Matthew Krohn (makrohn)",
      "Johannes Sjölund (wulax)",
      "Stephen Challener (Redshrike)",
      "thecilekli",
      "Thane Brimhall (pennomi)",
      "laetissima",
      "JaidynReiman",
      "Joe White",
    ],
    links: [
      "https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles",
      "https://opengameart.org/content/lpc-character-bases",
      "https://github.com/ElizaWy/LPC",
      "https://opengameart.org/content/lpc-hair",
      "https://opengameart.org/content/lpc-gentleman",
      "http://opengameart.org/content/lpc-clothing-updates",
      "https://opengameart.org/content/lpc-expanded-socks-shoes",
    ],
  },
  botAvatar: {
    type: "avatar" as const,
    name: "Botアバター",
    licenses: [
      {
        name: "OGA-BY 3.0",
        url: "https://static.opengameart.org/OGA-BY-3.0.txt",
      },
      {
        name: "CC-BY-SA 3.0",
        url: "https://creativecommons.org/licenses/by-sa/3.0/",
      },
      { name: "GPL 3.0", url: "https://www.gnu.org/licenses/gpl-3.0.en.html" },
    ],
    authors: [
      "bluecarrot16",
      "Evert",
      "TheraHedwig",
      "Benjamin K. Smith (BenCreating)",
      "MuffinElZangano",
      "Durrani",
      "Pierre Vigier (pvigier)",
      "Eliza Wyatt (ElizaWy)",
      "Matthew Krohn (makrohn)",
      "Johannes Sjölund (wulax)",
      "Stephen Challener (Redshrike)",
      "JaidynReiman",
      "Manuel Riecke (MrBeast)",
      "Joe White",
      "Thane Brimhall (pennomi)",
      "laetissima",
    ],
    links: [
      "https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles",
      "https://opengameart.org/content/lpc-character-bases",
      "https://github.com/ElizaWy/LPC",
      "https://opengameart.org/content/lpc-expanded-hair",
      "https://opengameart.org/content/lpc-gentleman",
      "http://opengameart.org/content/lpc-clothing-updates",
      "https://opengameart.org/content/lpc-expanded-pants",
    ],
  },
};

const LicenseInfo: React.FC<LicenseInfoProps> = ({ onBack }) => {
  const assetCredits: {
    assetName: string;
    description?: string;
    credits: CreditItem[];
  }[] = [
    {
      assetName: "2D空間タイルデザイン",
      credits: [
        {
          type: "detailed",
          name: '"tileset_office.png"',
          author: "nkorth",
          authorUrl: "https://opengameart.org/users/nkorth",
          sourceName: "OpenGameArt.org",
          sourceUrl: "https://opengameart.org/content/netslash-tiles",
          license: "CC BY 3.0",
          licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
        },
        {
          type: "simple",
          name: '"city_extension.png", "offie-space-tileset.png", "office-tilemap.png"',
          license: "CC0 1.0",
          licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/",
        },
      ],
    },
    {
      assetName: "アバター",
      description:
        "アバターは「Universal LPC Sprite Sheet Character Generator」を使用して作成されました。",
      credits: [
        lpcCredits.avatar1,
        lpcCredits.avatar2,
        lpcCredits.avatar3,
        lpcCredits.avatar4,
        lpcCredits.avatar5,
        lpcCredits.avatar6,
        lpcCredits.botAvatar,
      ],
    },
  ];

  const renderCreditItem = (item: CreditItem) => {
    switch (item.type) {
      case "detailed":
        return (
          <>
            <p>
              <strong>{item.name}</strong> by {item.author}
            </p>
            <ul>
              <li>
                <a
                  href={item.authorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  作者のページ
                </a>
              </li>
              <li>
                Source:{" "}
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.sourceName}
                </a>
              </li>
              <li>
                License:{" "}
                <a
                  href={item.licenseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.license}
                </a>
              </li>
            </ul>
          </>
        );
      case "simple":
        return (
          <p>
            <strong>{item.name}</strong> is licensed under{" "}
            <a href={item.licenseUrl} target="_blank" rel="noopener noreferrer">
              {item.license}
            </a>
            .
          </p>
        );
      case "avatar":
        return (
          <>
            <p>
              <strong>{item.name}</strong>
            </p>
            <ul>
              <li>
                <strong>Licenses:</strong>{" "}
                {item.licenses.map((l, i) => (
                  <span key={i}>
                    <a href={l.url} target="_blank" rel="noopener noreferrer">
                      {l.name}
                    </a>
                    {i < item.licenses.length - 1 && ", "}
                  </span>
                ))}
              </li>
              <li>
                <strong>Authors:</strong> {item.authors.join(", ")}
              </li>
              <li>
                <strong>Links:</strong>
                <ul>
                  {item.links.map((link, i) => (
                    <li key={i}>
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="license-info-container">
      <div className="license-info-header">
        <button onClick={onBack} className="license-back-button">
          ← 戻る
        </button>
        <h2 className="license-info-title">ライセンス情報</h2>
      </div>
      <div className="license-info-content">
        <div className="license-section">
          <h3>アセットの利用について</h3>
          <p>
            このアプリケーションでは、以下のオープンソースアセットを利用しています。素晴らしい作品を提供してくださったクリエイターの皆様に感謝いたします。
          </p>
          <div className="license-notice warning">
            <strong>
              【重要】本アプリケーションは、GPL
              3.0ライセンスの素材を利用しているため、GPL
              3.0ライセンスの下でソースコードを公開しています。
            </strong>
          </div>
        </div>

        {assetCredits.map((section, sectionIndex) => (
          <div key={sectionIndex} className="license-section">
            <h4>{section.assetName}</h4>
            {section.description && <p>{section.description}</p>}
            {section.credits.map((item, itemIndex) => (
              <div key={itemIndex} className="credit-item">
                {renderCreditItem(item)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LicenseInfo;
