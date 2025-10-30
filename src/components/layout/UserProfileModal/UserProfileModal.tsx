import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface UserProfileModalProps {
  visible: boolean;
  onClose: () => void;
  userRole?: string;
}

export function UserProfileModal({
  visible,
  onClose,
  userRole = "Vereador",
}: UserProfileModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as keyof typeof Colors];
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      onClose();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={[styles.modalContent, { backgroundColor: colors.background }]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.primaryText }]}>
              Meu Perfil
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <IconSymbol name="xmark" size={24} color={colors.secondaryText} />
            </TouchableOpacity>
          </View>

          {/* Avatar e Info Principal */}
          <View style={styles.profileSection}>
            <View
              style={[
                styles.avatarContainer,
                { backgroundColor: colors.primary },
              ]}
            >
              <IconSymbol name="person.fill" size={40} color="#ffffff" />
            </View>
            <Text style={[styles.userName, { color: colors.primaryText }]}>
              {user?.nome} {user?.sobrenome}
            </Text>
            <View
              style={[styles.roleBadge, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.roleText}>{userRole}</Text>
            </View>
          </View>

          {/* Informações */}
          <View style={styles.infoSection}>
            <View
              style={[
                styles.infoCard,
                { backgroundColor: "#ffffff", borderColor: colors.border },
              ]}
            >
              <View style={styles.infoRow}>
                <IconSymbol
                  name="person"
                  size={18}
                  color={colors.secondaryText}
                />
                <Text
                  style={[styles.infoLabel, { color: colors.secondaryText }]}
                >
                  Username
                </Text>
              </View>
              <Text style={[styles.infoValue, { color: colors.primaryText }]}>
                {user?.userName}
              </Text>
            </View>

            <View
              style={[
                styles.infoCard,
                { backgroundColor: "#ffffff", borderColor: colors.border },
              ]}
            >
              <View style={styles.infoRow}>
                <IconSymbol
                  name="envelope"
                  size={18}
                  color={colors.secondaryText}
                />
                <Text
                  style={[styles.infoLabel, { color: colors.secondaryText }]}
                >
                  Email
                </Text>
              </View>
              <Text style={[styles.infoValue, { color: colors.primaryText }]}>
                {user?.email}
              </Text>
            </View>

            {user?.phoneNumber && (
              <View
                style={[
                  styles.infoCard,
                  { backgroundColor: "#ffffff", borderColor: colors.border },
                ]}
              >
                <View style={styles.infoRow}>
                  <IconSymbol
                    name="phone"
                    size={18}
                    color={colors.secondaryText}
                  />
                  <Text
                    style={[styles.infoLabel, { color: colors.secondaryText }]}
                  >
                    Telefone
                  </Text>
                </View>
                <Text style={[styles.infoValue, { color: colors.primaryText }]}>
                  {user?.phoneNumber}
                </Text>
              </View>
            )}
          </View>

          {/* Botão de Logout */}
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: colors.error }]}
            onPress={handleLogout}
          >
            <IconSymbol name="arrow.right.square" size={20} color="#ffffff" />
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    maxHeight: "85%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  userName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.sm,
  },
  roleBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  roleText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: "#ffffff",
  },
  infoSection: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  infoCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  infoLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
  },
  infoValue: {
    fontSize: FontSizes.sm,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  logoutText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: "#ffffff",
  },
});
