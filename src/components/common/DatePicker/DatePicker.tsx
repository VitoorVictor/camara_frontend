import { IconSymbol } from "@/components/ui/icon-symbol";
import { BorderRadius, Colors, FontSizes, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// Using native date input for simplicity - for production, install @react-native-community/datetimepicker

interface DatePickerProps {
  value?: string; // formato YYYY-MM-DD
  onChange?: (date: string) => void;
  placeholder?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Selecione a data",
}: DatePickerProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as keyof typeof Colors];
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(
    value ? new Date(value) : new Date()
  );

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (dateString?: string): string => {
    if (!dateString) return placeholder;
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleOpenPicker = () => {
    setShowPicker(true);
  };

  const handleConfirm = () => {
    const formattedDate = formatDate(selectedDate);
    onChange?.(formattedDate);
    setShowPicker(false);
  };

  const handleClear = () => {
    setSelectedDate(new Date());
    onChange?.("");
    setShowPicker(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.container,
          {
            backgroundColor: "#ffffff",
            borderColor: "rgba(0, 0, 0, 0.1)",
          },
        ]}
        onPress={handleOpenPicker}
      >
        <IconSymbol name="calendar" size={20} color={colors.disabledText} />
        <Text
          style={[
            styles.text,
            {
              color: value ? colors.primaryText : colors.disabledText,
            },
          ]}
        >
          {formatDisplayDate(value)}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <Modal
          transparent
          animationType="slide"
          visible={showPicker}
          onRequestClose={() => setShowPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: colors.background },
              ]}
            >
              {Platform.OS === "web" ? (
                <input
                  type="date"
                  value={value || ""}
                  onChange={(e) => {
                    onChange?.(e.target.value);
                    setShowPicker(false);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPicker(true);
                  }}
                  style={{
                    width: "100%",
                    padding: Spacing.md,
                    fontSize: FontSizes.md,
                    borderRadius: BorderRadius.md,
                    border: `1px solid ${colors.border}`,
                    cursor: "pointer",
                  }}
                />
              ) : (
                <View>
                  <Text
                    style={[styles.modalTitle, { color: colors.primaryText }]}
                  >
                    Selecione a data
                  </Text>
                  <Text
                    style={[
                      styles.modalHelperText,
                      { color: colors.secondaryText },
                    ]}
                  >
                    Use o formato YYYY-MM-DD
                  </Text>
                  <TextInput
                    style={[
                      styles.dateInput,
                      {
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                        color: colors.primaryText,
                      },
                    ]}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={colors.disabledText}
                    value={value || formatDate(selectedDate)}
                    onChangeText={(text) => {
                      if (text.match(/^\d{4}-\d{2}-\d{2}$/)) {
                        const date = new Date(text);
                        if (!isNaN(date.getTime())) {
                          setSelectedDate(date);
                        }
                      }
                    }}
                  />
                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[
                        styles.modalButton,
                        styles.clearButton,
                        { borderColor: colors.border },
                      ]}
                      onPress={handleClear}
                    >
                      <Text
                        style={[
                          styles.modalButtonText,
                          { color: colors.error },
                        ]}
                      >
                        Limpar
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.modalButton,
                        { backgroundColor: colors.primary },
                      ]}
                      onPress={handleConfirm}
                    >
                      <Text style={styles.modalButtonText}>Confirmar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.sm,
    flex: 1,
    minHeight: 48,
  },
  text: {
    fontSize: FontSizes.md,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.lg,
    maxHeight: "50%",
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  modalHelperText: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.md,
  },
  dateInput: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  modalButtons: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  clearButton: {
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  modalButtonText: {
    fontSize: FontSizes.md,
    fontWeight: "600",
    color: "#ffffff",
  },
});
