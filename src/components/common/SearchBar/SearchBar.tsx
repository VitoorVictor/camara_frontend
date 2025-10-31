import { Spinner } from "@/components/common/Spinner";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { BorderRadius, Colors, FontSizes, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

interface SearchBarProps {
  placeholder?: string;
  value?: string; // Valor inicial apenas
  onChangeText?: (text: string) => void; // Opcional, não usado durante digitação
  onSearch?: (text: string) => void;
  onClear?: () => void; // Para limpar apenas a pesquisa
  onClearAll?: () => void; // Para limpar tudo (pesquisa + outros filtros)
  loading?: boolean;
  style?: any;
}

export function SearchBar({
  placeholder = "Encontre o que precisa",
  value,
  onChangeText,
  onSearch,
  onClear,
  onClearAll,
  loading = false,
  style,
}: SearchBarProps) {
  const [searchText, setSearchText] = useState(value || "");
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as keyof typeof Colors];

  // Sincroniza apenas quando o value externo muda (ex: quando limpa filtros)
  // mas não durante a digitação para evitar fechar o teclado
  useEffect(() => {
    if (value !== undefined && value !== searchText) {
      setSearchText(value);
    }
  }, [value]);

  const handleTextChange = (text: string) => {
    setSearchText(text);
    // Não chama onChangeText para evitar re-renders que fecham o teclado
  };

  const handleSearch = () => {
    onSearch?.(searchText);
  };

  const handleClear = () => {
    setSearchText("");
    // Se tiver onClearAll definido, limpa tudo (pesquisa + outros filtros)
    // Caso contrário, limpa só a pesquisa
    if (onClearAll) {
      onClearAll();
    } else {
      onClear?.();
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.searchContainer, { backgroundColor: "#ffffff" }]}>
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
          editable={!loading}
        />
        {searchText.length > 0 && !loading && (
          <TouchableOpacity
            onPress={handleClear}
            style={styles.clearTextButton}
          >
            <IconSymbol
              name="xmark.circle.fill"
              size={18}
              color={colors.disabledText}
            />
          </TouchableOpacity>
        )}
        {loading && (
          <View style={styles.loadingContainer}>
            <Spinner size="small" />
          </View>
        )}
      </View>
      <TouchableOpacity
        onPress={handleSearch}
        disabled={loading}
        style={[
          styles.searchButton,
          {
            backgroundColor: loading ? colors.inactive : colors.disabledText,
          },
        ]}
      >
        {loading ? (
          <Spinner size="small" color="#ffffff" />
        ) : (
          <IconSymbol name="magnifyingglass" size={18} color="#ffffff" />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "stretch",
    width: "100%",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomLeftRadius: BorderRadius.md,
    borderTopLeftRadius: BorderRadius.md,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    minHeight: 48,
  },
  textInput: {
    flex: 1,
    fontSize: FontSizes.md,
    paddingVertical: 0,
  },
  clearTextButton: {
    padding: Spacing.xs,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    padding: Spacing.xs,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButton: {
    padding: Spacing.sm,
    borderBottomRightRadius: BorderRadius.md,
    borderTopRightRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 48,
    minHeight: 48,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
});
