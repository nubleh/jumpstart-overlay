import React, { useState, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';

import data from './data';
import dataPrice from './dataPrice';
import boosterImg from './506px-Jumpstart_Booster.png';
import forest from './unstableforest.jpg';
import mountain from './unstablemountain.jpg';
import swamp from './unstableswamp.jpg';
import plains from './unstableplains.jpg';
import island from './unstableisland.jpg';
import terramorphicexpanse from './terramorphicexpanse.jpg';

const imgPath = 'https://gatherer.wizards.com/Handlers/Image.ashx?type=card&name=';
const linkPath = 'https://gatherer.wizards.com/Pages/Search/Default.aspx?name=';
const imgPathById = 'https://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=';
const linkPathById = 'https://gatherer.wizards.com/Pages/Card/Details.aspx?printed=true&multiverseid=';
const lands = [
  'Island',
  'Plains',
  'Mountain',
  'Swamp',
  'Forest',
];
const specialIdMap: { [key: string]: string } = {
  'Wizards Island': 'Island (47)',
  'Well-Read Island': 'Island (53)',
  'Under the Sea Island': 'Island (46)',
  'Spirits Island': 'Island (51)',
  'Pirates Island': 'Island (52)',
  'Milling Island': 'Island (50)',
  'Archaeology Island': 'Island (49)',
  'Above the Clouds Island': 'Island (48)',
  'Rainbow Terramorphic Expanse': 'Terramorphic Expanse',
  'Walls Forest': 'Forest (75)',
  'Tree-Hugging Forest': 'Forest (70)',
  'Predatory Forest': 'Forest (76)',
  'Plus One Forest': 'Forest (72)',
  'Lands Forest': 'Forest (71)',
  'Elves Forest': 'Forest (77)',
  'Dinosaurs Forest': 'Forest (73)',
  'Cats Forest': 'Forest (74)',
  'Spellcasting Mountain': 'Mountain (66)',
  'Smashing Mountain': 'Mountain (67)',
  'Seismic Mountain': 'Mountain (64)',
  'Minotaurs Mountain': 'Mountain (69)',
  'Lightning Mountain': 'Mountain (68)',
  'Goblins Mountain': 'Mountain (65)',
  'Dragons Mountain': 'Mountain (62)',
  'Devilish Mountain': 'Mountain (63)',
  'Unicorns Plains': 'Plains (41)',
  'Legion Plains': 'Plains (38)',
  'Heavily Armored Plains': 'Plains (43)',
  'Feathered Friends Plains': 'Plains (44)',
  'Enchanted Plains': 'Plains (42)',
  'Dogs Plains': 'Plains (45)',
  'Doctor Plains': 'Plains (39)',
  'Angels Plains': 'Plains (40)',
  'Witchcraft Swamp': 'Swamp (59)',
  'Vampires Swamp': 'Swamp (60)',
  'Spooky Swamp': 'Swamp (61)',
  'Rogues Swamp': 'Swamp (57)',
  'Reanimated Swamp': 'Swamp (56)',
  'Phyrexian Swamp': 'Swamp (58)',
  'Minions Swamp': 'Swamp (54)',
  'Discarding Swamp': 'Swamp (55)',
};
const idMap: { [key: string]: number } = {
  'Wizards Island': 489631,
  'Well-Read Island': 489637,
  'Under the Sea Island': 489630,
  'Spirits Island': 489635,
  'Pirates Island': 489636,
  'Milling Island': 489634,
  'Archaeology Island': 489633,
  'Above the Clouds Island': 489632,
  'Rainbow Terramorphic Expanse': 489662,
  'Walls Forest': 489659,
  'Tree-Hugging Forest': 489654,
  'Predatory Forest': 489660,
  'Plus One Forest': 489656,
  'Lands Forest': 489655,
  'Elves Forest': 489661,
  'Dinosaurs Forest': 489657,
  'Cats Forest': 489658,
  'Spellcasting Mountain': 489650,
  'Smashing Mountain': 489651,
  'Seismic Mountain': 489648,
  'Minotaurs Mountain': 489653,
  'Lightning Mountain': 489652,
  'Goblins Mountain': 489649,
  'Dragons Mountain': 489646,
  'Devilish Mountain': 489647,
  'Unicorns Plains': 489625,
  'Legion Plains': 489622,
  'Heavily Armored Plains': 489627,
  'Feathered Friends Plains': 489628,
  'Enchanted Plains': 489626,
  'Dogs Plains': 489629,
  'Doctor Plains': 489623,
  'Angels Plains': 489624,
  'Witchcraft Swamp': 489643,
  'Vampires Swamp': 489644,
  'Spooky Swamp': 489645,
  'Rogues Swamp': 489641,
  'Reanimated Swamp': 489640,
  'Phyrexian Swamp': 489642,
  'Minions Swamp': 489638,
  'Discarding Swamp': 489639,

  // plain ones
  'Swamp': 488467,
  'Plains': 488461,
  'Forest': 488473,
  'Mountain': 488470,
  'Island': 488464,
};

const priceByName = dataPrice.prices.reverse().reduce((c, n) => {
  c[n.name] = n;
  return c;
}, {} as { [key: string]: { name: string, price: number, specialName?: string }});

const getImg = (cardName: string) => {
  if (idMap[cardName]) {
    return `${imgPathById}${idMap[cardName]}`;
  }
  return `${imgPath}${cardName.replace(/'/g, '%27')}`;
};

const MTGObtainedPackCacheKey = 'MTGObtainedPackCacheKey';
const startingObtainedPacks = (() => {
  const storedJson = localStorage.getItem(MTGObtainedPackCacheKey);
  if (!storedJson) {
    return [];
  }
  try {
    const parsedData = JSON.parse(storedJson);
    return parsedData;
  } catch(e) {
    return [];
  }
})() as string[];

const Jumpstart = () => {
  const [obtainedPacks, set_obtainedPacks] = useState(startingObtainedPacks);
  const [selectedName, set_selectedName] = useState('');
  const [searchQuery, set_searchQuery] = useState('');
  const [packOpen, set_packOpen] = useState(false);
  const [draw, set_draw] = useState(true);
  const selectedPack = data.data.find(item => {
    return item.name === selectedName;
  });

  useEffect(() => {
    localStorage.setItem(MTGObtainedPackCacheKey, JSON.stringify(obtainedPacks));
  }, [obtainedPacks]);
  useEffect(() => {
    set_selectedName('');
  }, [searchQuery])
  const caughtPack = data.data.filter(item => {
    return item.name === selectedName || (
      item.name.replace(/\W/g, '').toLowerCase().indexOf(searchQuery.replace(/\W/g, '').toLowerCase()) !== -1
    );
  });
  const selectedPackData = useMemo(() => {
    return selectedPack?.cards.map(card => {
      return {
        img: getImg(card),
        name: card,
      };
    }) || [];
  }, [selectedPack]);

  const cardRef = useRef({} as { [key: string]: HTMLElement });
  const packRectRef = useRef(null as null | DOMRect);
  const imgRef = useRef(null as null | HTMLImageElement);
  const lastCarded = useRef(['', ['']] as [string, string[]]);

  const selectedPackValue = selectedPackData ? selectedPackData.reduce((c, n) => {
    return c + getPriceByCardName(n.name);
  }, 0) : 0;

  const obtainedPackData = useMemo(() => {
    const thisData = obtainedPacks.reduce((c, n) => {
      const pack = data.data.find(p => p.name === n);
      if (!pack) {
        return c;
      }
      const total = pack.cards.reduce((carry, card) => {
        return carry + getPriceByCardName(card);
      }, 0);
      c.packs.push(n);
      c.total += total;
      return c;
    }, {
      packs: [] as string[],
      total: 0,
    });
    return thisData;
  }, [obtainedPacks]);

  return <MainContainer>
    {selectedPack && <CardsList
    >
      <div>
        <AddButton>
          <button
            onClick={() => {
              set_obtainedPacks([
                ...obtainedPacks,
                selectedPack.name,
              ]);
            }}
          >
            GET
          </button>
          <span style={{ color: '#000' }}>
            {selectedPack.name}
          </span> <span style={{ color: '#000' }}>
            ${selectedPackValue.toFixed(2)}
          </span>
        </AddButton>
      </div>
      <div key={selectedPack.name}>
        {selectedPackData.map((card, cardIndex) => {
          const cardPrice = getPriceByCardName(card.name);
          return <CardImg
            key={cardIndex}
            style={{
              backgroundImage: `url('${card.img}')`,
              // transform: `rotateZ(${Math.random()*12 - 6}deg)`,
            }}
            ref={(el: HTMLElement | null) => {
              const packRect = packRectRef.current;
              if (
                !el
                || !packRect
                || (
                  lastCarded.current[0] === selectedPack.name
                  && lastCarded.current[1].indexOf(`${card.name}${cardIndex}`) !== -1
                )
              ) {
                return;
              }
              const rects = el.getClientRects();
              const rect = rects[0];
              const moveX = rect.x - packRect.x + rect.width / 2 + packRect.width / 2;
              const moveY = rect.y - packRect.y - rect.height / 2;
              el.style.transform = `translateX(${-moveX}px) translateY(${-moveY}px) scale(0)`;
            }}
          >
            {cardPrice > 0 && <span>
              {cardPrice.toFixed(2)}
            </span>}
            <img
              ref={lands.indexOf(card.name) === -1 && idMap[card.name] ? imgRef : undefined}
              src={card.img.indexOf('?') === -1
                ? card.img // + `?${Math.random()}`
                : card.img // + `&${Math.random()}`
              }
              onLoad={(e) => {
                if (lastCarded.current[0] !== selectedPack.name) {
                  lastCarded.current = [selectedPack.name, []];
                }
                if (
                  lastCarded.current[0] === selectedPack.name
                  && lastCarded.current[1].indexOf(`${card.name}${cardIndex}`) !== -1
                ) {
                  return;
                }
                lastCarded.current[1].push(`${card.name}${cardIndex}`);
                if (e.currentTarget.parentElement && packOpen) {
                  const el = e.currentTarget.parentElement;
                  setTimeout(() => {
                    el.style.transitionDelay = `${Math.random() * 0.1}s`;
                    el.style.transform = '';
                    el.style.opacity = '1';
                  }, 200);
                }
              }
            }/>
          </CardImg>
        })}
      </div>
    </CardsList>}
    {caughtPack.length > 0 && <PackBar>
      {caughtPack.map(pack => {
        return <div
          key={pack.name}
          onClick={(e) => {
            packRectRef.current = e.currentTarget.getClientRects()[0];
            if (selectedName === pack.name && packOpen) {
              set_packOpen(false);
              lastCarded.current = ['', []];
              setTimeout(() => {
                set_selectedName('');
              }, 600)
            } else {
              set_packOpen(true);
              set_selectedName(pack.name);
            }
            // set_searchQuery('');
          }}
          style={{
            ...(selectedName && selectedName !== pack.name ? {
              opacity: 0,
              pointerEvents: 'none',
              transform: 'none',
            } : {}),
          }}
        >
          <Pack style={{
            transform: `rotateZ(${Math.random()*12 - 6}deg)`,
            ...(selectedName && selectedName === pack.name ? {
              transform: 'scale(0.5)',
            } : {}),
          }}>
            {pack.name}
          </Pack>
        </div>;
      })}
    </PackBar>}
    <SearchBar>
      <input value={searchQuery} onChange={(e) => {
        set_searchQuery(e.currentTarget.value);
      }} onContextMenu={(e) => {
        set_draw(!draw);
        e.preventDefault();
      }}/>
    </SearchBar>

    {draw && selectedPack && <div>
      <canvas
        style={{
          height: '90vh',
          position: 'absolute',
          zIndex: 1,
          top: 20,
          left: 20,
          boxShadow: '0 3px 6px rgba(0, 0, 0, 0.3)',
        }}
        ref={async (el) => {
          if (!el) {
            return;
          }
          el.height = el.offsetHeight;
          el.width = el.height / 76 * 49;

          if (!selectedPack) {
            return;
          }
          
          const ctx = el.getContext('2d');
          if (!ctx) {
            return;
          }

          const text = selectedPack.cards.sort((a, b) => {
            if (idMap[a] && idMap[b]) {
              if (lands.indexOf(a) !== -1 && lands.indexOf(b) === -1) {
                return -1;
              }
              if (lands.indexOf(a) === -1 && lands.indexOf(b) !== -1) {
                return 1;
              }
            }
            if (idMap[a] && !idMap[b]) {
              return 1;
            }
            if (!idMap[a] && idMap[b]) {
              return -1;
            }
            return a > b ? 1 : a < b ? -1 : 0;
          });
          // 1488 2078
          let targetBG = '';
          if (text.indexOf('Island') !== -1) {
            targetBG = island;
          }
          if (text.indexOf('Forest') !== -1) {
            targetBG = forest;
          }
          if (text.indexOf('Swamp') !== -1) {
            targetBG = swamp;
          }
          if (text.indexOf('Plains') !== -1) {
            targetBG = plains;
          }
          if (text.indexOf('Mountain') !== -1) {
            targetBG = mountain;
          }
          if (selectedPack.name === 'RAINBOW') {
            targetBG = terramorphicexpanse;
          }
          if (targetBG) {
            const dummy = document.createElement('img');
            const h = el.height;
            let w = el.height / 2078 * 1488;
            if (selectedPack.name === 'RAINBOW') {
              w = el.height / 1102 * 1500;
            }
            await (new Promise((resolve) => {
              dummy.onload = () => {
                ctx.drawImage(dummy, -(w - el.width) / 2, 0, w, h);
                resolve();
              };
              dummy.src = targetBG;
            }));
          }


          const margin = 60;
          const availHeight = el.height - margin * 2;
          const size = availHeight / 21;
          ctx.font = `${size * 0.9}px Corbel`;
          ctx.textAlign = 'center';
          ctx.fillStyle = '#000';
          ctx.fillText(selectedPack.name, el.width / 2, margin * 0.6 + size + 2);
          ctx.fillStyle = '#000';
          ctx.fillText(selectedPack.name, el.width / 2 + 2, margin * 0.6 + size + 2);
          ctx.fillStyle = '#fff';
          ctx.fillText(selectedPack.name, el.width / 2, margin * 0.6 + size);
          text.forEach((t, i) => {
            ctx.textAlign = 'end';
            ctx.fillStyle = '#000';
            ctx.fillText(t, el.width - margin, margin + (2 + i) * size + 2);
            ctx.fillStyle = '#000';
            ctx.fillText(t, el.width - margin + 2, margin + (2 + i) * size + 2);
            ctx.fillStyle = '#fff';
            ctx.fillText(t, el.width - margin, margin + (2 + i) * size);
          });

          if (imgRef.current) {
            imgRef.current.addEventListener('load', () => {
              if (imgRef.current) {
                // 265 370
                const w = el.width / 3;
                const h = (w) / 265 * 370;
                const x = margin * 0.51;
                const y = el.height - margin * 1.25 - h;
                ctx.drawImage(
                  imgRef.current,
                  x,
                  y,
                  w,
                  h
                );
              }
            });

            imgRef.current.src = imgRef.current.src + '';
          }

          const shadow = 4;
          ctx.strokeStyle = '#ccc';
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(margin, margin / 2 + shadow);
          ctx.lineTo(el.width - margin, margin / 2 + shadow);
          ctx.bezierCurveTo(
            el.width - margin * 0.75, margin / 2 + shadow,
            el.width - margin / 2, margin * 0.75 + shadow,
            el.width - margin / 2, margin + shadow
          );
          ctx.lineTo(el.width - margin / 2, el.height - margin + shadow);
          ctx.bezierCurveTo(
            el.width - margin / 2, el.height - margin * 0.75 + shadow,
            el.width - margin * 0.75, el.height - margin / 2 + shadow,
            el.width - margin, el.height - margin / 2 + shadow
          );
          ctx.lineTo(margin, el.height - margin / 2 + shadow);
          ctx.bezierCurveTo(
            margin * 0.75, el.height - margin / 2 + shadow,
            margin / 2, el.height - margin * 0.75 + shadow,
            margin / 2, el.height - margin + shadow,
          );
          ctx.lineTo(margin / 2, margin + shadow);
          ctx.bezierCurveTo(
            margin / 2, margin * 0.75 + shadow,
            margin * 0.75, margin / 2 + shadow,
            margin, margin / 2 + shadow
          );
          ctx.stroke();

          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(margin, margin / 2);
          ctx.lineTo(el.width - margin, margin / 2);
          ctx.bezierCurveTo(
            el.width - margin * 0.75, margin / 2,
            el.width - margin / 2, margin * 0.75,
            el.width - margin / 2, margin
          );
          ctx.lineTo(el.width - margin / 2, el.height - margin);
          ctx.bezierCurveTo(
            el.width - margin / 2, el.height - margin * 0.75,
            el.width - margin * 0.75, el.height - margin / 2,
            el.width - margin, el.height - margin / 2
          );
          ctx.lineTo(margin, el.height - margin / 2);
          ctx.bezierCurveTo(
            margin * 0.75, el.height - margin / 2,
            margin / 2, el.height - margin * 0.75,
            margin / 2, el.height - margin,
          );
          ctx.lineTo(margin / 2, margin);
          ctx.bezierCurveTo(
            margin / 2, margin * 0.75,
            margin * 0.75, margin / 2,
            margin, margin / 2
          );
          ctx.stroke();
        }}
      />
    </div>}

    {obtainedPacks.length > 0 && <MoneyBar>
      {/* {obtainedPackData.packs.sort((a, b) => {
        const dataA = data.data.find(pack => pack.name === a);
        const dataB = data.data.find(pack => pack.name === b);
        const obtainedPackValueA = dataA ? dataA.cards.reduce((c, n) => {
          return c + getPriceByCardName(n);
        }, 0) : 0;
        const obtainedPackValueB = dataB ? dataB.cards.reduce((c, n) => {
          return c + getPriceByCardName(n);
        }, 0) : 0;
        return obtainedPackValueA > obtainedPackValueB ? 1 : obtainedPackValueA < obtainedPackValueB ? -1 : 0;
      }).map((obtainedPack, index) => { */}
      {obtainedPackData.packs.map((obtainedPack, index) => {
        const obtainedPackCards = data.data.find(pack => pack.name === obtainedPack);
        if (!obtainedPackCards) {
          return null;
        }
        const obtainedPackValue = obtainedPackCards ? obtainedPackCards.cards.reduce((c, n) => {
          return c + getPriceByCardName(n);
        }, 0) : 0;
        return <MoneyItem onClick={() => {
          set_obtainedPacks((prevObtainedPacks) => {
            return prevObtainedPacks.filter((_, i) => i !== index);
          });
        }}>
          {obtainedPack} ${obtainedPackValue.toFixed(2)}
        </MoneyItem>;
      })}
      <MoneyTotal>
        ${obtainedPackData.total.toFixed(2)} / $255
        <br/>
        {obtainedPacks.length} / 48 packs opened 
      </MoneyTotal>
    </MoneyBar>}
  </MainContainer>;
};

const w = 436;
const MainContainer = styled.div`
  font-family: sans-serif;
  font-size: 20px;
  color: #fff;
  width: 1920px;
  height: 1080px;
  font-family: Corbel;

  div {
    &::-webkit-scrollbar {
      width: 1px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: darkgrey;
    }
  }
`;

const MoneyBar = styled.div`
  position: fixed;
  bottom: 85px;
  left: 10px;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  text-align: right;
  z-index: 2;
`;
const MoneyTotal = styled.div`
  border-top: solid 2px #fff;
`;
const MoneyItem = styled.div`
  cursor: pointer;
  user-select: none;
  font-size: 12px;
  &:hover {
    opacity: 0.6;
  }
`;

const AddButton = styled.div`
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  user-select: none;

  span {
    display: inline-block;
    vertical-align: middle;
  }

  > button {
    background: #0c0;
    cursor: pointer;
    border-radius: 4px;
    padding: 6px 10px;
    border: none;
    margin: 0 20px;
    display: inline-block;
    vertical-align: middle;
    color: #fff;

    &:hover {
      transform: scale(1.1);
    }
    &:active {
      transform: scale(0.9);
    }
  }
`;

// 265 370
const cardW = 170;
const cardH = cardW / 265 * 370;
const CardImg = styled.div`
  display: inline-block;
  width: ${cardW}px;
  height: ${cardH}px;
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  margin: 2px;
  margin-bottom: ${-cardH/4}px;
  transition: transform 0.5s;
  opacity: 0;
  position: relative;
  transform-origin: right top;

  > img {
    opacity: 0;
    pointer-events: none;
    position: absolute;
  }

  &:hover {
    z-index: 1;
    transform: scale(1.8);
  }

  > span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    padding: 2px 8px;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    font-size: 12px;

    &::before {
      content: '$';
    }
  }
`;

const CardsList = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  padding: 28px 0;
  border-radius: 8px;
  width: ${w + 300}px;
  text-align: center;

  &:hover {
    z-index: 1;
  }
`;

const Pack = styled.div`
  width: 120px;
  position: relative;
  background-image: url('${boosterImg}');
  height: 213px;
  background-size: 100% auto;
  font-size: 10px;
  padding: 12px 10px;
  text-align: center;
  box-sizing: border-box;
  margin-bottom: -150px;
  transition: transform 0.3s, opacity 0.3s;
  color: #000;

  &:hover {
    transform: scale(2) !important;
    z-index: 1;
    opacity: 0.9;
  }

  &:active {
    transform: translateY(2px) scale(2) !important;
  }
`;
const PackBar = styled.div`
  position: fixed;
  bottom: 0;
  top: 0;
  overflow: auto;
  right: 10px;
  padding: 10px 10px 10px 150px;
  border-radius: 8px;
  width: ${w}px;

  > div {
    display: inline-block;
    transition: opacity 0.3s, transform 0.3s;
  }
`;

const SearchBar = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  background: #fff;
  padding: 10px;
  border-radius: 8px;
  width: ${w}px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  z-index: 5;

  input {
    display: block;
    border: solid 1px #ccc;
    border-width: 0 0 1px 0;
    width: 100%;
    font-size: 30px;

    &:focus {
      outline: none;
      border-color: #000;
    }
  }
`;

function getPriceByCardName(name: string) {
  let cardPrice = priceByName[name]?.price || 0;
  if (!cardPrice && idMap[name]) {
    const specialName = specialIdMap[name];
    cardPrice = priceByName[specialName]?.price || 0;
  }
  return cardPrice;
}

export default Jumpstart;
