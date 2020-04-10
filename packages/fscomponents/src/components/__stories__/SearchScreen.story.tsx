import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { StyleSheet, View } from 'react-native';
import { SearchBar } from '../SearchBar';
import { text } from '@storybook/addon-knobs'; // tslint:disable-line:no-implicit-dependencies

const onClose = () => {
  alert(text('title', 'close'));
};

const searchIcon = require('../../../assets/images/search.png');

const style = StyleSheet.create({
  searchBarContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#7f0000'
  },
  searchIconStyle: {
    backgroundColor: '#7f0000'
  },
  inputTextStyle: {
    color: '#7f0000'
  },
  containerStyle: {
    borderColor: '#7f0000'
  }
});

const renderSearchScreen = (): JSX.Element => {
  return (
    <View style={style.searchBarContainer}>
      <SearchBar
        onCancel={onClose}
        showSearchIcon={true}
        searchIcon={searchIcon}
        cancelButtonAlwaysVisible={true}
      />
    </View>
  );
};

const renderCustomSearchScreen = (): JSX.Element => {
  return (
    <View style={style.searchBarContainer}>
      <SearchBar
        onCancel={onClose}
        showSearchIcon={true}
        searchIcon={searchIcon}
        cancelButtonAlwaysVisible={true}
        searchIconStyle={style.searchIconStyle}
        inputTextStyle={style.inputTextStyle}
        containerStyle={style.containerStyle}
      />
    </View>
  );
};

storiesOf('SearchScreen', module).
add('basic usage', renderSearchScreen).
add('custom styling', renderCustomSearchScreen);
