import { Box} from '@mui/material'
import TypingAnim from '../components/typer/TypingAnim';
import Footer from '../components/footer/Footer';

const Home = () => {

  return (
    <>
    <Box width={'100%'}
        height={"100%"}
        flex={"flex"}
        mx={"auto"}>
      <Box sx={{
        display:"flex",
        width : "100%",
        flexDirection : "column",
        alignItems : "center",
        mx : "auto",
        mt:"3"
      }}>
        <Box><TypingAnim/></Box>
        <Box sx={{
          width : '100%',
          display : 'flex',
          flexDirection : {md:"row", xs:"column",sm : "column"},
          gap : 5,
          my : 10,
        }}>
          <img src="robot.png" alt="robot-img"
            style = {{
              width : '200px',
              margin : 'auto'
            }} />
          <img src="gemini.png" alt="gemini-img"
            className='image-inverted rotate'
            style = {{
              width : '200px',
              margin : 'auto'
            }} />
        </Box>
        <Box sx={{
          display : "flex",
          mx : "auto"
        }}>
          
        </Box>
      </Box>
      <Footer/>
    </Box>
    </>
  )
}

export default Home;