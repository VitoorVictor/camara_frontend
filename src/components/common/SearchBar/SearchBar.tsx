import { IconSymbol } from "@/components/ui/icon-symbol";
import { BorderRadius, Colors, FontSizes, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSearch?: (text: string) => void;
  style?: any;
}

export function SearchBar({
  placeholder = "Encontre o que precisa",
  value,
  onChangeText,
  onSearch,
  style,
}: SearchBarProps) {
  const [searchText, setSearchText] = useState(value || "");
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as keyof typeof Colors];

  const handleTextChange = (text: string) => {
    setSearchText(text);
    onChangeText?.(text);
  };

  const handleSearch = () => {
    onSearch?.(searchText);
  };

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.searchContainer, { backgroundColor: "#ffffff" }]}>
        <IconSymbol
          name="magnifyingglass"
          size={28}
          color={colors.disabledText}
        />
        <TextInput
          style={[
            styles.textInput,
            {
              color: colors.primaryText,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.disabledText}
          value={searchText}
          onChangeText={handleTextChange}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: "100%",
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  textInput: {
    flex: 1,
    fontSize: FontSizes.md,
    paddingVertical: 0,
  },
});
