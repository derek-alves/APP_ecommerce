import React, { Component, useState ,useEffect} from 'react';
import { 
  Text, 
  View, 
  FlatList,
  StyleSheet,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image
}from 'react-native';
import Swiper from 'react-native-swiper';
import api from './services/api';


const {height, width} = Dimensions.get('window');



const App = () => {

  const [selectCatg,setselectCatg] = useState(null);
  const [banner, setBanner] = useState([]);
  const [categories, setCategories] = useState([]);
  const [foods,setFoods] = useState([]);
  const [refreshing,setRefreshing] = useState(false)

 

  function renderPage(index){
    return (<Image key={index} style={styles.imageBanner} source={banner[index]}/>)
  }
  const pagesCount = banner.length;
  const imgRender = [...new Array(pagesCount)].map((it, idx) => {
    return renderPage(idx);
  });

  async function LoadData()
  {
    const responseB = await api.get('banner');
    setBanner([...responseB.data]);
    
    const responseC = await api.get('categories');
    setCategories([...responseC.data]);

    const responseA = await api.get('food');
    setFoods([...responseA.data]);
     
  }

  const Categories = ({categories}) =>{
    const {id,image,color,name} = categories;
    return(
        <TouchableOpacity 
        style={[styles.Categorie,
        {backgroundColor:color}]}
        onPress={
          ()=>{
            setselectCatg(id)
          }
        }
        >
            <Image
            style={{width:100, height:80}}
            resizeMode="contain"
            source={{uri:image}}
            />
            <Text style={{fontWeight:'400',fontSize:22}}>{name}</Text>
        </TouchableOpacity>
    )
  }

  const Foods = ({foods}) =>{
    const {name,price,categorie,image} = foods;
    let catg = selectCatg;
    if(catg == null || catg == categorie){
      return(
          <TouchableOpacity style={styles.divFood}>
                  <Image
                    style={styles.imageFood}
                    resizeMode="contain"
                    source={{uri:image}}
                  />

                  <View
                  style={{
                    height:((width/2)-20)-90, 
                    backgroundColor:'transparent', 
                    width:((width/2)-20)-10}}
                  />

                  <Text style={{
                    fontWeight:'bold',
                    fontSize:17,
                    textAlign:'center'}}>
                      {name}
                  </Text>
                  <Text style={{textAlign:"center"}}>Descp Food and Details</Text>
                  <View style={styles.bottom}> 
                      <Text style={{
                          fontSize:20,
                          color:"green",
                          }}
                      >
                      ${price}
                      </Text>
                  </View>
            </TouchableOpacity>
        
      )
    }
  }
    
      useEffect(() => {
        LoadData();
      },[]);

    
  return (
    <ScrollView>
        <View style={{ flex: 1,backgroundColor:"#f2f2f2"}}>
          <View style={{width:width,alignItems:"center"}}>
            <Image 
            resizeMode='contain' 
            style={{height:60,width:width/2,margin:10}} 
            source={require("./assets/img/foodapp.png")}/>

            <Swiper 
            style={{height:width/2}} 
            containerStyle={{width: width}} 
            showsButtons={false} autoplay={true} 
            autoplayTimeout={2}
            key={banner.length}>
              {
                imgRender
              }
            </Swiper>
            <View style={{width:width, borderRadius:20, paddingVertical:20, backgroundColor:'white'}}>
            <Text style={styles.titleCatg}>Categories {selectCatg}</Text>
           
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    data={categories}
                    keyExtractor = { (item,index) => index.toString() }
                    renderItem={({ item }) =><Categories categories={item}/>} 
                    
                  />
          
                  <FlatList
                  showsVerticalScrollIndicator={false}
                  numColumns={2}
                  data={foods}
                  keyExtractor={(item,index)=>index.toString()}
                  renderItem={({item})=><Foods foods={item}/>}
                  extraData={foods}    
                  />
            </View>
            
          </View>
        </View>
    </ScrollView>
  );
  
}

const styles = StyleSheet.create({
  imageBanner: {
    height:width/2,
    width:width-40,
    borderRadius:10,
    marginHorizontal:20
  }, 
  
  Categorie:{
    backgroundColor:'red',
    margin:5,
    alignItems:'center',
    borderRadius:10,
    padding:10
  },
  titleCatg:{
    fontSize:20,
    fontWeight:'bold',
    textAlign:'center',
    marginBottom:10
  },
  imageFood:{
    width:((width/2)-20)-10,
    height:((width/2)-20)-30,
    backgroundColor:'transparent',
    position:'absolute',
    top:-45
  },
  divFood:{
    width:(width/2)-20,
    padding:10,
    borderRadius:10,
    marginTop:55,
    marginBottom:5,
    marginLeft:13,
    alignItems:'center',
    elevation:8,
    shadowOpacity:0.3,
    shadowRadius:50,
    backgroundColor:'white',
  },
  bottom: { 
    flex: 1, 
    justifyContent: 'flex-end',  
  }
});

export default App;