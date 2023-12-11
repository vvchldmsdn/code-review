import { InfoBoxType } from '../lib/definitions';
import HomeMap from '../ui/mapSearch/homeMap';
import InfoBox from '../ui/mapSearch/infoBox'

export default function MapSearch() {
  function bandSize({bands, direction}: { bands: number; direction: string;}) {
    let direc;
    let margin;
    const screenWidth = 1920;  // 화면의 가로 길이
    const screenHeight = 923;  // 화면의 세로 길이
    const gutter = 10;  // 띠 사이의 간격
    const totalBands = 12;  // 띠의 총 개수
  
    if (direction === 'width') {
      direc = screenWidth;
      margin = 80;
    } else {
      direc = screenHeight;
      margin = 60;
    }
  
    return ((direc - 2 * margin - gutter * (totalBands - 1)) / totalBands) * bands + gutter * (bands - 1);
  };

  function boxLocation({ x, y }: { x: number, y: number }) {
    const l = 80 + (x - 1) * (bandSize({ bands: 1, direction: 'width'}) + 10 );
    const t = 60 + (y - 1) * (bandSize({ bands: 1, direction: 'height'}) + 10 );
    return [l, t];
  }

  const CardDataArray: Array<InfoBoxType> = [
    {
      key: 1,
      color: '#6D8E75',
      title: '곤도르',
      content: '반지의 제왕 중에서 인간이 주로 거주하는 왕국으로, 중간계의 남부에 위치해 있습니다. 원래 수도인 민아스 이리스가 적에게 빼앗긴 후에는 민아스 티리스를 수도로 삼았으며, 그곳이 백색의 도시로 불립니다. 반지의 전쟁에서는 아라곤이 곤도르의 왕으로서 권리를 주장하고, 사우론의 압박 속에서도 그의 지배를 거부하며 중요한 역할을 수행합니다.',
      width: bandSize({bands: 2, direction: 'width'}),
      height: bandSize({bands: 6, direction: 'height'}),
      left: boxLocation({ x: 1, y: 1})[0],
      top: boxLocation({ x: 1, y: 1})[1],
      type: 'region',
    },
    {
      key: 2,
      color: '#D9D9D9',
      title: 'Gondor has no king, Gondor needs no king',
      width: bandSize({bands: 2, direction: 'width'}),
      height: bandSize({bands: 2, direction: 'height'}),
      left: boxLocation({ x: 1, y: 7})[0],
      top: boxLocation({ x: 1, y: 7})[1],
      type: 'line',
    },
    {
      key: 3,
      color: '#9788EF',
      title: '아라곤',
      content: '반지의 제왕에서 주요 인물로, 곤도르의 정당한 왕이자 반지원정대의 리더입니다. 아라곤은 아르노르의 마지막 왕의 후손이며, 이실두르의 직계 후예입니다. 그는 뛰어난 전투력과 지도력을 바탕으로 중간계를 사우론의 지배로부터 구하였습니다.',
      width: bandSize({bands: 2, direction: 'width'}),
      height: bandSize({bands: 4, direction: 'height'}),
      left: boxLocation({ x: 1, y: 9})[0],
      top: boxLocation({ x: 1, y: 9})[1],
      type: 'character',
    },
    {
      key: 4,
      color: '#9788EF',
      title: '엘렌딜',
      content: '실마릴리온에서 주요 인물로, 남노르의 왕이자 아라곤의 선조입니다. 엘렌딜은 아마노르에서 태어나 벨리안드로 이민가, 그곳에서 왕이 되었습니다. 그는 발록에 맞서 싸우고, 사람들을 이끌어 발린오르와 모르고스에 대항했습니다.',
      width: bandSize({bands: 2, direction: 'width'}),
      height: bandSize({bands: 4, direction: 'height'}),
      left: boxLocation({ x: 3, y: 9})[0],
      top: boxLocation({ x: 3, y: 9})[1],
      type: 'character',
    },
    {
      key: 5,
      color: '#9788EF',
      title: '보로미르',
      content: '반지의 제왕 중에서 등장하는 곤도르의 왕자로, 데네소르 왕의 큰아들이자 아라곤의 친구입니다. 그는 반지원정대의 일원으로서, 원래는 반지를 이용해 곤도르를 구하려는 의도에서 출발하지만, 반지의 유혹에 빠져 프로도에게 반란을 일으킵니다. 그러나 결국 자신의 잘못을 깨닫고, 원정대를 지키기 위해 오크들과 싸우다가 목숨을 잃습니다.',
      width: bandSize({bands: 2, direction: 'width'}),
      height: bandSize({bands: 4, direction: 'height'}),
      left: boxLocation({ x: 5, y: 9})[0],
      top: boxLocation({ x: 5, y: 9})[1],
      type: 'character',
    }
  ];

  const mapData = {
    width: bandSize({bands: 8, direction: 'width'}),
    height: bandSize({bands: 8, direction: 'height'}),
    left: boxLocation({ x: 3, y: 1})[0],
    top: boxLocation({ x: 3, y: 1})[1],
  }

  return (
    <>
      {CardDataArray.map((item: InfoBoxType) => {
        return (<InfoBox infoBoxData={item}></InfoBox>)
      })}
      <HomeMap mapData={mapData}></HomeMap>
    </>
  )
}
