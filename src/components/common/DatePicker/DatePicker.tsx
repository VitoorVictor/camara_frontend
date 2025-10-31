import { IconSymbol } from "@/components/ui/icon-symbol";
import { BorderRadius, Colors, FontSizes, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DatePickerProps {
  value?: string; // formato YYYY-MM-DD
  onChange?: (date: string) => void;
  placeholder?: string;
  onClear?: () => void; // Para limpar apenas a data
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Selecione a data",
  onClear,
}: DatePickerProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as keyof typeof Colors];
  const [showPicker, setShowPicker] = useState(false);

  // Função para criar Date a partir de string YYYY-MM-DD sem problemas de timezone
  const parseDateFromString = (dateString: string): Date => {
    if (!dateString) return new Date();
    const [year, month, day] = dateString.split("-").map(Number);
    // Cria a data usando valores locais para evitar conversão de timezone
    return new Date(year, month - 1, day);
  };

  const [selectedDate, setSelectedDate] = useState<Date>(
    value ? parseDateFromString(value) : new Date()
  );

  useEffect(() => {
    if (value) {
      setSelectedDate(parseDateFromString(value));
    }
  }, [value]);

  const formatDate = (date: Date): string => {
    // Usa métodos locais para evitar problemas de timezone
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (dateString?: string): string => {
    if (!dateString) return placeholder;
    // Parse a string YYYY-MM-DD diretamente sem passar pelo Date object
    // para evitar problemas de timezone
    const [year, month, day] = dateString.split("-");
    if (year && month && day) {
      // Retorna formatado no padrão brasileiro
      return `${day}/${month}/${year}`;
    }
    // Fallback se o formato não estiver correto
    const date = new Date(dateString + "T12:00:00"); // Usa meio-dia para evitar problemas de timezone
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleOpenPicker = () => {
    setShowPicker(true);
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
      if (event.type === "set" && date) {
        const formattedDate = formatDate(date);
        onChange?.(formattedDate);
      }
    } else {
      // iOS - mostra picker em modal
      if (date) {
        setSelectedDate(date);
      }
    }
  };

  const handleConfirm = () => {
    const formattedDate = formatDate(selectedDate);
    onChange?.(formattedDate);
    setShowPicker(false);
  };

  const handleCancel = () => {
    // Restaura a data original se cancelado
    if (value) {
      setSelectedDate(new Date(value));
    }
    setShowPicker(false);
  };

  const handleClear = () => {
    onChange?.("");
    setShowPicker(false);
  };

  return (
    <>
      <View style={styles.wrapper}>
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
        {value && (
          <TouchableOpacity
            onPress={() => {
              onChange?.("");
              onClear?.();
            }}
            style={[styles.clearButton, { backgroundColor: colors.error }]}
          >
            <IconSymbol name="xmark" size={14} color="#ffffff" />
          </TouchableOpacity>
        )}
      </View>

      {showPicker && (
        <>
          {Platform.OS === "android" ? (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              locale="pt-BR"
            />
          ) : Platform.OS === "ios" ? (
            <Modal
              transparent
              animationType="slide"
              visible={showPicker}
              onRequestClose={handleCancel}
            >
              <View style={styles.modalOverlay}>
                <View
                  style={[
                    styles.modalContent,
                    { backgroundColor: colors.background },
                  ]}
                >
                  <View style={styles.iosPickerContainer}>
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display="spinner"
                      onChange={handleDateChange}
                      locale="pt-BR"
                      style={styles.iosPicker}
                    />
                  </View>
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
                        { borderColor: colors.border },
                      ]}
                      onPress={handleCancel}
                    >
                      <Text
                        style={[
                          styles.modalButtonText,
                          { color: colors.primaryText },
                        ]}
                      >
                        Cancelar
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
              </View>
            </Modal>
          ) : (
            // Web fallback
            <Modal
              transparent
              animationType="slide"
              visible={showPicker}
              onRequestClose={handleCancel}
            >
              <View style={styles.modalOverlay}>
                <View
                  style={[
                    styles.modalContent,
                    { backgroundColor: colors.background },
                  ]}
                >
                  {/* @ts-ignore - web only */}
                  <input
                    type="date"
                    value={value || formatDate(selectedDate)}
                    onChange={(e: any) => {
                      if (e.target.value) {
                        onChange?.(e.target.value);
                        setShowPicker(false);
                      }
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
                </View>
              </View>
            </Modal>
          )}
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: Spacing.sm,
    flex: 1,
  },
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
  clearButton: {
    width: 48,
    minHeight: 48,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
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
  iosPickerContainer: {
    height: 200,
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  iosPicker: {
    width: "100%",
    height: 200,
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
  modalButtonText: {
    fontSize: FontSizes.md,
    fontWeight: "600",
    color: "#ffffff",
  },
});
