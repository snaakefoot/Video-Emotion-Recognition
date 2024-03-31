import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Table = ({ data }) => {
  return (
    <View style={styles.container}>
      {Object.keys(data).map((key) => (
        <View style={styles.row} key={key}>
          <Text style={styles.column}>{key}</Text>
          <Text style={styles.column}>{data[key]}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  column: {
    flex: 1,
    marginRight: 10,
  },
});

export default Table;