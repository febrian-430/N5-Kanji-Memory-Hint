import React, { useEffect, useState, useRef } from "react";
import { Alert, FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import shuffle from "../../helper/shuffler";
import Screen from '../cmps/screen'
import { Kanji as kanji } from "../../helper/repo"
import { Full } from "../horizontal_scroll";
import { MODE, FIELD } from "../const";

const Option = ({value, onPress, disabled, selected}) => {

  let style = styles.option_default
  if(disabled) {
    style = styles.option_solved
  } else if(selected) {
    style = styles.option_selected
  }

  const { backgroundColor, borderColor, color } = style
  const wrapperStyle = { backgroundColor, borderColor }

  return (
    <TouchableOpacity onPress={onPress} style={[styles.item, wrapperStyle]} disabled={disabled}>
      <Text style={[styles.title, {color}]}>{value}</Text>
    </TouchableOpacity>
  )
}

const MemoryHint = ({ route }) => {

    const [options, setOptions] = useState([0])
    const [solved, setSolved] = useState([])
    const [selected, setSelected] = useState([])
    const [wrongCount, setWrongCount] = useState(0)
    const [mode, setMode] = useState(MODE.IMAGE_MEANING)
    const isStarted = useRef(false)

    useEffect(() => {
      function getKeys(mode) {
        if(mode === MODE.IMAGE_MEANING) {
          return [FIELD.IMAGE, FIELD.RUNE]
        } else {
          return [FIELD.RUNE, FIELD.SPELLING]
        }
      }


      const selectedChapters = route.params.chapters
      
      const gameMode = route.params.mode
      setMode(gameMode)
      const [key1, key2] = getKeys(gameMode)

      console.log("GAME MODE:", gameMode)

      var source = shuffle(kanji.filter((kanji) => selectedChapters.includes(kanji.chapter))).slice(0,5)
      questions = source.map((element) =>  { return { value: element[key1], key: element[key2] }})
      answers = source.map((element) => { return { value: element[key2], key: element[key1] }} )

      mixed = [...questions, ...answers]
      mixed = shuffle(mixed)

      setOptions([...mixed])
    }, [])

    const select = (option) => {
      if(selected.length == 0) {
        setSelected([...selected, option])
      } else {
        if(selected[0].value === option.key) {
          setSolved([...solved, option, selected[0]])
        } else {
          setWrongCount(wrongCount+1)
        }
        setSelected([])
      }
      console.log(selected)
    }

    const deselect = () => {
      setSelected([])
    }

    const onOptionPress = (option) => {
      if(selected[0]?.value === option.value) {
        deselect()
      } else {
        select(option)
      }
    }

    useEffect(() => {
      if(isStarted && solved.length === options.length) {
        alert(`Finished. Wrong attempts: ${wrongCount}`)
      }
    }, [solved])

    const renderItem = ({ item }) => {
      return (
        <Option
          key={item.value}
          value={item.value}
          onPress={() => onOptionPress(item)}
          disabled={solved.includes(item)}
          selected={selected.includes(item)}
        />
      );
    };

    return (
      <Screen>
        <Full style={[styles.container]}>
          <FlatList
            data={options}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${index}`}
            extraData={selected}
          />
        </Full>
      </Screen>
    );
};  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },

  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 2,
    color: "white",
    backgroundColor: "green",
  },

  option_default: {
    backgroundColor: "white",
    color: "black",
    borderColor: "black"
  },

  option_selected: {
    backgroundColor: "green", 
    color: "white",
    borderColor: "green" 
  },

  option_solved: {
    backgroundColor: "grey", 
    color: "white",
    borderColor: "grey" 
  },

  title: {
    fontSize: 32,
  },
});

export default MemoryHint;