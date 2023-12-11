import { InfoBoxType } from "../../lib/definitions";

const getStylesByType = (type: string) => {
  switch(type) {
    case 'region':
      return {
        boxPadding: '25px 22.5px', 
        titleSize: '60px', 
        titleMargin: '0 0 20px 0', 
        contentSize: '18px', 
        contentMargin: '0 0 0 0'
      };
    case 'line':
      return {
        boxPadding: '40px 40px', 
        titleSize: '20px', 
        titleMargin: '0 0 5px 0', 
        contentSize: '8px', 
        contentMargin: '0 0 0 0'
      };
    case 'character':
      return {
        boxPadding: '15px 22.5px', 
        titleSize: '50px', 
        titleMargin: '0 0 10px 0', 
        contentSize: '16px', 
        contentMargin: '0 0 0 0'
      }
    default:
      return {}; 
  }
}

export default function InfoBox({ infoBoxData }: { infoBoxData: InfoBoxType; }) {
  const { boxPadding, titleSize, titleMargin, contentSize, contentMargin } = getStylesByType(infoBoxData.type);

  const boxStyle = {
    backdropFilter: 'blur(5px)',
    backgroundColor: infoBoxData.color,
    width: `${infoBoxData.width}px`,
    height: `${infoBoxData.height}px`,
    left: `${infoBoxData.left}px`,
    top: `${infoBoxData.top}px`,
    position: 'absolute' as 'absolute',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    padding: `${boxPadding}`,
    boxSizing: 'border-box' as 'border-box',
  };

  const titleStyle = {
    fontSize: `${titleSize}`,
    margin: `${titleMargin}`,
  };

  const contentStyle = {
    fontSize: `${contentSize}`,
    margin: `${contentMargin}`,
  };

  return (
    <div style={boxStyle}>
      <h1 style={titleStyle}>{infoBoxData.title}</h1>
      <p style={contentStyle}>{infoBoxData.content}</p>
    </div>
  )
}
