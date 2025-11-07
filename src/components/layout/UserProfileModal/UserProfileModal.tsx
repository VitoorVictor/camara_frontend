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
import React, { useRef, useState } from "react";
import {
  Animated,
  Modal,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
  const { user, camara, signOut } = useAuth();
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Só responde se movimento vertical for maior que horizontal
        // E estiver arrastando para baixo com movimento significativo
        if (gestureState.dy <= 0) return false;
        const isVertical =
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
        return isVertical && gestureState.dy > 10;
      },
      onPanResponderGrant: () => {
        setScrollEnabled(false);
        translateY.setOffset(0);
        translateY.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        // Só permite arrastar para baixo
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
          // Diminui a opacidade do overlay enquanto arrasta
          const newOpacity = Math.max(0.3, 1 - gestureState.dy / 300);
          opacity.setValue(newOpacity);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        setScrollEnabled(true);
        translateY.flattenOffset();

        // Se arrastou mais de 100px para baixo ou com velocidade alta, fecha o modal
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: 1000,
              duration: 250,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 250,
              useNativeDriver: true,
            }),
          ]).start(() => {
            translateY.setValue(0);
            opacity.setValue(1);
            onClose();
          });
        } else {
          // Retorna para a posição original
          Animated.parallel([
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
              tension: 65,
              friction: 11,
            }),
            Animated.spring(opacity, {
              toValue: 1,
              useNativeDriver: true,
              tension: 65,
              friction: 11,
            }),
          ]).start();
        }
      },
      onPanResponderTerminate: () => {
        setScrollEnabled(true);
        translateY.flattenOffset();
        Animated.parallel([
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
          }),
          Animated.spring(opacity, {
            toValue: 1,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
          }),
        ]).start();
      },
    })
  ).current;

  const handleLogout = async () => {
    try {
      await signOut();
      onClose();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // Reset da animação quando o modal abre
  React.useEffect(() => {
    if (visible) {
      translateY.setValue(0);
      opacity.setValue(1);
    }
  }, [visible, translateY, opacity]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlayContainer}>
        <Animated.View
          style={[
            styles.modalOverlay,
            {
              opacity,
            },
          ]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={onClose}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.modalContent,
            { backgroundColor: colors.background },
            {
              transform: [{ translateY }],
            },
          ]}
        >
          {/* Handle Bar e Header - Área arrastável */}
          <View style={styles.dragArea} {...panResponder.panHandlers}>
            <View style={styles.handleContainer}>
              <View style={styles.handleBar} />
            </View>
          </View>

          {/* Header - Também arrastável */}
          <View style={styles.header} {...panResponder.panHandlers}>
            <Text style={[styles.title, { color: colors.primaryText }]}>
              Meu Perfil
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.closeButton,
                { backgroundColor: colors.border + "20" },
              ]}
            >
              <IconSymbol name="xmark" size={20} color={colors.secondaryText} />
            </TouchableOpacity>
          </View>

          {/* Conteúdo com ScrollView */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            scrollEnabled={scrollEnabled}
            bounces={false}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
          >
            {/* Avatar e Info Principal */}
            <View style={styles.profileSection}>
              <View
                style={[
                  styles.avatarContainer,
                  {
                    backgroundColor: colors.primary,
                    borderColor: colors.primary + "30",
                  },
                ]}
              >
                <IconSymbol name="person.fill" size={44} color="#ffffff" />
              </View>
              <Text style={[styles.userName, { color: colors.primaryText }]}>
                {user?.nome}
              </Text>
              <View
                style={[
                  styles.roleBadge,
                  {
                    backgroundColor: colors.primary + "15",
                    borderColor: colors.primary + "40",
                  },
                ]}
              >
                <IconSymbol
                  name="person.badge.shield.checkmark"
                  size={14}
                  color={colors.primary}
                />
                <Text style={[styles.roleText, { color: colors.primary }]}>
                  {userRole}
                </Text>
              </View>
            </View>

            {/* Divisor */}
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />

            {/* Informações */}
            <View style={styles.infoSection}>
              <Text
                style={[styles.sectionTitle, { color: colors.secondaryText }]}
              >
                Informações Pessoais
              </Text>
              <View
                style={[
                  styles.infoCard,
                  {
                    backgroundColor: "#ffffff",
                    borderColor: colors.border,
                    shadowColor: "#000",
                  },
                ]}
              >
                <View style={styles.infoRow}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: colors.primary + "15" },
                    ]}
                  >
                    <IconSymbol
                      name="person.circle"
                      size={20}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.infoContent}>
                    <Text
                      style={[
                        styles.infoLabel,
                        { color: colors.secondaryText },
                      ]}
                    >
                      Username
                    </Text>
                    <Text
                      style={[styles.infoValue, { color: colors.primaryText }]}
                    >
                      {user?.usuario}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Informações da Câmara */}
              {camara && (
                <>
                  <Text
                    style={[
                      styles.sectionTitle,
                      { color: colors.secondaryText, marginTop: Spacing.md },
                    ]}
                  >
                    Informações da Câmara
                  </Text>
                  <View
                    style={[
                      styles.infoCard,
                      {
                        backgroundColor: "#ffffff",
                        borderColor: colors.border,
                        shadowColor: "#000",
                      },
                    ]}
                  >
                    <View style={styles.infoRow}>
                      <View
                        style={[
                          styles.iconContainer,
                          { backgroundColor: colors.primary + "15" },
                        ]}
                      >
                        <IconSymbol
                          name="building.2.fill"
                          size={20}
                          color={colors.primary}
                        />
                      </View>
                      <View style={styles.infoContent}>
                        <Text
                          style={[
                            styles.infoLabel,
                            { color: colors.secondaryText },
                          ]}
                        >
                          Câmara
                        </Text>
                        <Text
                          style={[
                            styles.infoValue,
                            { color: colors.primaryText },
                          ]}
                        >
                          {camara.nome}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.infoCard,
                      {
                        backgroundColor: "#ffffff",
                        borderColor: colors.border,
                        shadowColor: "#000",
                      },
                    ]}
                  >
                    <View style={styles.infoRow}>
                      <View
                        style={[
                          styles.iconContainer,
                          { backgroundColor: colors.primary + "15" },
                        ]}
                      >
                        <IconSymbol
                          name="location.fill"
                          size={20}
                          color={colors.primary}
                        />
                      </View>
                      <View style={styles.infoContent}>
                        <Text
                          style={[
                            styles.infoLabel,
                            { color: colors.secondaryText },
                          ]}
                        >
                          Localização
                        </Text>
                        <Text
                          style={[
                            styles.infoValue,
                            { color: colors.primaryText },
                          ]}
                        >
                          {camara.cidade}, {camara.estado}
                        </Text>
                      </View>
                    </View>
                  </View>
                </>
              )}
            </View>

            {/* Botão de Logout */}
            <TouchableOpacity
              style={[
                styles.logoutButton,
                {
                  backgroundColor: colors.error,
                  shadowColor: colors.error,
                },
              ]}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <IconSymbol
                name="arrow.right.square.fill"
                size={20}
                color="#ffffff"
              />
              <Text style={styles.logoutText}>Sair da Conta</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlayContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    height: "80%",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    flexGrow: 1,
  },
  dragArea: {
    width: "100%",
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    alignItems: "center",
  },
  handleContainer: {
    width: "100%",
    paddingVertical: Spacing.sm,
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    letterSpacing: -0.5,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
    borderWidth: 4,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  userName: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.sm,
    letterSpacing: -0.3,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  roleText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.lg,
    opacity: 0.2,
  },
  infoSection: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  infoCard: {
    padding: Spacing.md + 2,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  infoValue: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    lineHeight: 20,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md + 4,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    marginTop: Spacing.md,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  logoutText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: "#ffffff",
    letterSpacing: 0.3,
  },
});
