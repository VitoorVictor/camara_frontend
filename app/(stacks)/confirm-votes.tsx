import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { EmptyState } from "@/components/common/EmptyState";
import { Spinner } from "@/components/common/Spinner";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/theme";
import { useSession } from "@/contexts/SessionContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { STORAGE_KEYS } from "@/services/api";
import { Project, projectsService } from "@/services/projectsService";
import {
  Voto,
  VotosPorSessaoProjeto,
  votingService,
} from "@/services/votingService";
import { useAuth } from "@/src/contexts/AuthContext";
import { formatDate } from "@/utils/formatters";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Modal,
  RefreshControl,
  SectionBase,
  SectionList,
  SectionListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ConfirmVotesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as keyof typeof Colors];
  const { activeSession } = useSession();
  const { presidente } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<VotosPorSessaoProjeto | null>(null);
  const [confirmedData, setConfirmedData] =
    useState<VotosPorSessaoProjeto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);

  // Estados para modais de confirmação
  const [acceptAllModal, setAcceptAllModal] = useState(false);
  const [acceptVoteModal, setAcceptVoteModal] = useState<Voto | null>(null);

  // Estado para modal de finalizar votação
  const [finishVotingModal, setFinishVotingModal] = useState(false);
  const [updatingProjectStatus, setUpdatingProjectStatus] = useState(false);
  const [sessaoProjetoId, setSessaoProjetoId] = useState<string | null>(null);

  // SignalR - conexão simples
  const signalRConnection = useRef<HubConnection | null>(null);
  const [signalRStatus, setSignalRStatus] = useState<string>("Desconectado");

  const loadProject = useCallback(async (): Promise<{
    project: Project | null;
    sessaoProjetoId: string | null;
  }> => {
    if (!activeSession?.id) {
      setProject(null);
      setSessaoProjetoId(null);
      setData(null);
      setConfirmedData(null);
      setLoading(false);
      return { project: null, sessaoProjetoId: null };
    }

    try {
      const projects = await projectsService.getBySession(activeSession.id);
      // Busca o projeto em votação
      const projectInVoting =
        projects.find((p) => p.status === "EmVotacao") || null;
      setProject(projectInVoting);

      if (projectInVoting) {
        // Busca o sessaoProjetoId
        try {
          const sessaoProjetoIdResult = await votingService.getSessaoProjetoId(
            projectInVoting.id,
            activeSession.id
          );
          setSessaoProjetoId(sessaoProjetoIdResult);
          return {
            project: projectInVoting,
            sessaoProjetoId: sessaoProjetoIdResult,
          };
        } catch (error) {
          console.error("Erro ao buscar sessaoProjetoId:", error);
          setSessaoProjetoId(null);
          setData(null);
          setConfirmedData(null);
          setLoading(false);
          return { project: projectInVoting, sessaoProjetoId: null };
        }
      }

      setSessaoProjetoId(null);
      setData(null);
      setConfirmedData(null);
      setLoading(false);
      return { project: null, sessaoProjetoId: null };
    } catch (error) {
      console.error("Erro ao carregar projeto:", error);
      setSessaoProjetoId(null);
      setProject(null);
      setData(null);
      setConfirmedData(null);
      setLoading(false);
      return { project: null, sessaoProjetoId: null };
    }
  }, [activeSession?.id]);

  const fetchVotesData = useCallback(
    async (
      sessaoProjetoIdParam: string,
      projectParam: Project,
      sessionIdParam: string,
      silent = false
    ) => {
      try {
        if (!silent) {
          setLoading(true);
        }
        setError(null);

        const [pendingResponse, confirmedResponse] = await Promise.all([
          votingService.listVereadoresByVotosInSessaoProjeto(
            sessaoProjetoIdParam
          ),
          votingService.listConfirmedVotesByProjetoAndSessao(
            projectParam.id,
            sessionIdParam
          ),
        ]);

        setData(pendingResponse);
        setConfirmedData(confirmedResponse);
      } catch (err: any) {
        console.error("Erro ao carregar dados dos vereadores:", err);
        setError(err.message || "Erro ao carregar dados");
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  useEffect(() => {
    if (sessaoProjetoId) {
      loadVereadoresData();
    }
  }, [sessaoProjetoId]);

  // Refs para dados atuais (evita dependências no useEffect)
  const currentSessaoProjetoIdRef = useRef(sessaoProjetoId);
  const currentProjectRef = useRef(project);
  const currentActiveSessionRef = useRef(activeSession);
  const fetchVotesDataRef = useRef(fetchVotesData);
  const loadProjectRef = useRef(loadProject);

  // Atualiza refs quando valores mudam
  useEffect(() => {
    currentSessaoProjetoIdRef.current = sessaoProjetoId;
    currentProjectRef.current = project;
    currentActiveSessionRef.current = activeSession;
    fetchVotesDataRef.current = fetchVotesData;
    loadProjectRef.current = loadProject;
  }, [sessaoProjetoId, project, activeSession, fetchVotesData, loadProject]);

  // SignalR - Conecta quando há sessão ativa (implementação simples)
  useEffect(() => {
    let isMounted = true;

    const iniciarSignalR = async () => {
      const sessaoId = activeSession?.id;
      const sessaoStatus = activeSession?.status;

      // Só conecta se houver sessão ativa e status "EmAndamento"
      if (!sessaoId || sessaoStatus !== "EmAndamento") {
        // Desconecta se não há sessão válida
        if (signalRConnection.current) {
          try {
            await signalRConnection.current.stop();
          } catch (err) {
            console.error("Erro ao desconectar SignalR:", err);
          }
          if (isMounted) {
            signalRConnection.current = null;
            setSignalRStatus("Desconectado");
          }
        }
        return;
      }

      // Se já está conectado e conectado, não conecta novamente
      if (signalRConnection.current) {
        const connectionState = signalRConnection.current.state;
        if (connectionState === "Connected") {
          console.log("✅ SignalR já está conectado");
          if (isMounted) {
            setSignalRStatus("Conectado");
          }
          return;
        }
        // Se não está conectado, limpa a conexão anterior
        try {
          await signalRConnection.current.stop();
        } catch (err) {
          console.error("Erro ao parar conexão anterior:", err);
        }
        signalRConnection.current = null;
      }

      try {
        // Cria conexão SignalR com reconexão automática customizada
        const conn = new HubConnectionBuilder()
          .withUrl("http://192.168.3.12:5097/hubs/sessao", {
            accessTokenFactory: async () => {
              const currentToken = await AsyncStorage.getItem(
                STORAGE_KEYS.ACCESS_TOKEN
              );
              return currentToken || "";
            },
          })
          .configureLogging(LogLevel.Information)
          .withAutomaticReconnect({
            // Intervalos de reconexão (em milissegundos)
            // Tenta reconectar imediatamente, depois 2s, 10s, 30s, e então a cada 30s
            nextRetryDelayInMilliseconds: (retryContext) => {
              if (retryContext.previousRetryCount === 0) return 0; // Primeira tentativa: imediato
              if (retryContext.previousRetryCount === 1) return 2000; // Segunda: 2 segundos
              if (retryContext.previousRetryCount === 2) return 10000; // Terceira: 10 segundos
              return 30000; // Demais: 30 segundos
            },
          })
          .build();

        // Handlers dos eventos (usam refs para acessar valores atuais)
        conn.on("VotacaoAberta", (dados) => {
          console.log("📢 VotacaoAberta:", dados);
          // Atualiza os dados quando votação é aberta
          const currentSessaoProjetoId = currentSessaoProjetoIdRef.current;
          const currentProject = currentProjectRef.current;
          const currentActiveSession = currentActiveSessionRef.current;
          const fetchVotes = fetchVotesDataRef.current;

          if (
            currentSessaoProjetoId &&
            currentProject &&
            currentActiveSession?.id
          ) {
            fetchVotes(
              currentSessaoProjetoId,
              currentProject,
              currentActiveSession.id,
              true
            );
          }
        });

        conn.on("VotacaoEncerrada", (dados) => {
          console.log("📕 VotacaoEncerrada:", dados);
          // Recarrega projeto quando votação é encerrada
          const currentActiveSession = currentActiveSessionRef.current;
          const loadProj = loadProjectRef.current;
          const fetchVotes = fetchVotesDataRef.current;

          if (currentActiveSession?.id) {
            loadProj().then(
              ({
                project: reloadedProject,
                sessaoProjetoId: reloadedSessaoProjetoId,
              }) => {
                if (
                  reloadedSessaoProjetoId &&
                  reloadedProject &&
                  currentActiveSession?.id
                ) {
                  fetchVotes(
                    reloadedSessaoProjetoId,
                    reloadedProject,
                    currentActiveSession.id,
                    true
                  );
                }
              }
            );
          }
        });

        conn.on("VotosConfirmados", (dados) => {
          console.log("✅ VotosConfirmados:", dados);
          // Atualiza os dados quando votos são confirmados
          const currentSessaoProjetoId = currentSessaoProjetoIdRef.current;
          const currentProject = currentProjectRef.current;
          const currentActiveSession = currentActiveSessionRef.current;
          const fetchVotes = fetchVotesDataRef.current;

          if (
            currentSessaoProjetoId &&
            currentProject &&
            currentActiveSession?.id
          ) {
            fetchVotes(
              currentSessaoProjetoId,
              currentProject,
              currentActiveSession.id,
              true
            );
          }
        });

        // ✅ Handlers para eventos de reconexão
        conn.onreconnecting((error) => {
          console.warn("🟡 SignalR reconectando...", error);
          if (isMounted) {
            setSignalRStatus("Reconectando...");
          }
        });

        conn.onreconnected(async (connectionId) => {
          console.log("🟢 SignalR reconectado! ConnectionId:", connectionId);
          if (isMounted) {
            setSignalRStatus("Conectado");

            // Reentra no grupo da sessão após reconectar (usa ref para valor atual)
            const currentActiveSession = currentActiveSessionRef.current;
            const currentSessaoId = currentActiveSession?.id;
            if (currentSessaoId) {
              try {
                await conn.invoke("JoinSessaoGroup", currentSessaoId);
                console.log("👥 Reentrou no grupo da sessão", currentSessaoId);
              } catch (err) {
                console.error("❌ Erro ao reentrar no grupo:", err);
              }
            }
          }
        });

        conn.onclose((error) => {
          console.warn("🔴 SignalR desconectado.", error);
          if (isMounted) {
            // Se a conexão foi fechada manualmente (signalRConnection.current é null),
            // mostra status de desconectado
            // Caso contrário, o SignalR vai tentar reconectar automaticamente
            // e o status será atualizado para "Reconectando..." no onreconnecting
            if (!signalRConnection.current) {
              setSignalRStatus("Desconectado");
            }
            // Se signalRConnection.current ainda existe, significa que não foi fechado manualmente
            // e o SignalR vai tentar reconectar automaticamente (onreconnecting será chamado)
          }
        });

        // Conecta
        await conn.start();
        if (isMounted) {
          setSignalRStatus("Conectado");
          console.log("✅ Conectado ao SignalR");

          // Entra no grupo da sessão
          await conn.invoke("JoinSessaoGroup", sessaoId);
          console.log("👥 Entrou no grupo da sessão", sessaoId);

          signalRConnection.current = conn;
        } else {
          // Se o componente desmontou, desconecta
          await conn.stop();
        }
      } catch (err) {
        console.error("❌ Erro ao conectar SignalR:", err);
        if (isMounted) {
          setSignalRStatus("Erro");
          signalRConnection.current = null;
        }
      }
    };

    iniciarSignalR();

    // Cleanup - desconecta quando desmonta ou quando a sessão muda
    return () => {
      isMounted = false;
      if (signalRConnection.current) {
        signalRConnection.current
          .stop()
          .then(() => {
            console.log("🔌 Desconectado do SignalR");
            if (isMounted) {
              signalRConnection.current = null;
              setSignalRStatus("Desconectado");
            }
          })
          .catch((err) => {
            console.error("Erro ao desconectar SignalR:", err);
          });
      }
    };
  }, [activeSession?.id, activeSession?.status]);

  const loadVereadoresData = async () => {
    if (!sessaoProjetoId || !project || !activeSession?.id) {
      if (!sessaoProjetoId) {
        setLoading(false);
      }
      return;
    }

    await fetchVotesData(sessaoProjetoId, project, activeSession.id);
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const {
        project: refreshedProject,
        sessaoProjetoId: refreshedSessaoProjetoId,
      } = await loadProject();

      if (refreshedProject && refreshedSessaoProjetoId && activeSession?.id) {
        await fetchVotesData(
          refreshedSessaoProjetoId,
          refreshedProject,
          activeSession.id
        );
      }
    } finally {
      setRefreshing(false);
    }
  };

  const confirmedVotes = useMemo(
    () => confirmedData?.votos ?? [],
    [confirmedData]
  );

  const confirmedVoteIds = useMemo(() => {
    return new Set(confirmedVotes.map((vote) => vote.id));
  }, [confirmedVotes]);

  const pendingVotes = useMemo(() => {
    if (!data?.votos) {
      return [];
    }

    return data.votos.filter(
      (vote) => !vote.votoConfirmado && !confirmedVoteIds.has(vote.id)
    );
  }, [data, confirmedVoteIds]);

  type VoteSection = SectionBase<Voto> & {
    keyType: "pending" | "confirmed";
    title: string;
  };

  const sections: VoteSection[] = useMemo(() => {
    return [
      {
        key: "pending",
        keyType: "pending",
        title: "Votos para confirmar",
        data: pendingVotes,
      },
      {
        key: "confirmed",
        keyType: "confirmed",
        title: "Votos confirmados",
        data: confirmedVotes,
      },
    ];
  }, [pendingVotes, confirmedVotes]);

  const handleAcceptAllVotes = () => {
    setAcceptAllModal(true);
  };

  const handleConfirmAcceptAll = async () => {
    setAcceptAllModal(false);
    if (!data || !sessaoProjetoId) return;

    try {
      await projectsService.confirmAllVotes(sessaoProjetoId);
      Alert.alert("Sucesso", "Todos os votos foram aceitos!");
      loadVereadoresData();
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao aceitar todos os votos");
    }
  };

  const handleAcceptVote = (voto: Voto) => {
    setAcceptVoteModal(voto);
  };

  const handleConfirmAcceptVote = async () => {
    if (!acceptVoteModal || !sessaoProjetoId) return;

    try {
      await projectsService.confirmVote(
        sessaoProjetoId,
        acceptVoteModal.vereadorVotante.id
      );
      Alert.alert("Sucesso", "Voto aceito com sucesso!");
      setAcceptVoteModal(null);
      loadVereadoresData();
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao aceitar o voto");
    }
  };

  // Handlers para finalizar votação
  const handleFinishVoting = () => {
    setFinishVotingModal(true);
  };

  const handleConfirmFinishApprove = async () => {
    if (!project || !activeSession?.id) return;
    setFinishVotingModal(false);

    try {
      setUpdatingProjectStatus(true);
      await projectsService.updateStatus(
        activeSession.id,
        project.id,
        "Aprovado"
      );
      Alert.alert("Sucesso", "Projeto marcado como aprovado!");
      await loadProject();
      await loadVereadoresData();
      if (presidente) {
        router.push("/(stacks)/projects-by-session");
      }
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao aprovar o projeto");
    } finally {
      setUpdatingProjectStatus(false);
    }
  };

  const handleConfirmFinishReject = async () => {
    if (!project || !activeSession?.id) return;
    setFinishVotingModal(false);

    try {
      setUpdatingProjectStatus(true);
      await projectsService.updateStatus(
        activeSession.id,
        project.id,
        "Reprovado"
      );
      Alert.alert("Sucesso", "Projeto marcado como rejeitado!");
      await loadProject();
      await loadVereadoresData();
      if (presidente) {
        router.push("/(stacks)/projects-by-session");
      }
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao rejeitar o projeto");
    } finally {
      setUpdatingProjectStatus(false);
    }
  };

  const formatVoteDate = (dateString: string) => {
    if (!dateString || dateString === "0001-01-01T00:00:00") {
      return "Não informado";
    }
    try {
      return formatDate(dateString, true);
    } catch {
      return "Data inválida";
    }
  };

  const getVoteLabel = (valor: string) => {
    switch (valor) {
      case "Sim":
        return "Aprovar";
      case "Nao":
        return "Rejeitar";
      case "Abstencao":
        return "Abster-se";
      default:
        return valor;
    }
  };

  const getVoteColor = (valor: string) => {
    switch (valor) {
      case "Sim":
        return colors.success;
      case "Nao":
        return colors.error;
      case "Abstencao":
        return colors.warning;
      default:
        return colors.inactive;
    }
  };

  const renderVoteItem = ({ item: voto }: { item: Voto }) => {
    console.log("renderVoteItem - voto", voto);

    return (
      <View
        style={[
          styles.voteCard,
          {
            backgroundColor: "#ffffff",
            borderColor: colors.border,
            borderLeftWidth: voto.votoConfirmado ? 4 : 1,
            borderLeftColor: voto.votoConfirmado
              ? colors.success
              : colors.border,
          },
        ]}
      >
        <View style={styles.voteCardContent}>
          <View style={styles.voteInfo}>
            <Text style={[styles.vereadorName, { color: colors.primaryText }]}>
              {voto.vereadorVotante.nome}
            </Text>
            <View style={styles.voteDetails}>
              <View
                style={[
                  styles.voteBadge,
                  {
                    backgroundColor: "transparent",
                    borderWidth: 1,
                    borderColor: getVoteColor(voto.valor),
                  },
                ]}
              >
                <Text
                  style={[
                    styles.voteBadgeLabel,
                    { color: colors.secondaryText },
                  ]}
                >
                  Voto:
                </Text>
                <Text
                  style={[
                    styles.voteBadgeValue,
                    { color: getVoteColor(voto.valor) },
                  ]}
                >
                  {getVoteLabel(voto.valor)}
                </Text>
              </View>
              <Text style={[styles.voteTime, { color: colors.secondaryText }]}>
                {formatVoteDate(voto.dataHora)}
              </Text>
            </View>
          </View>
          <View style={styles.voteActions}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.acceptButton,
                {
                  backgroundColor: voto.votoConfirmado
                    ? colors.inactive
                    : colors.success,
                },
              ]}
              onPress={() => handleAcceptVote(voto)}
              disabled={voto.votoConfirmado}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>
                {voto.votoConfirmado ? "Aceito" : "Aceitar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderConfirmedVoteItem = ({ item: voto }: { item: Voto }) => (
    <View
      style={[
        styles.voteCard,
        {
          backgroundColor: "#ffffff",
          borderColor: colors.border,
          borderLeftWidth: 4,
          borderLeftColor: colors.success,
        },
      ]}
    >
      <View style={styles.voteCardContent}>
        <View style={styles.voteInfo}>
          <Text style={[styles.vereadorName, { color: colors.primaryText }]}>
            {voto.vereadorVotante.nome}
          </Text>
          <View style={styles.voteDetails}>
            <View
              style={[
                styles.voteBadge,
                {
                  backgroundColor: colors.success + "15",
                  borderWidth: 1,
                  borderColor: colors.success,
                },
              ]}
            >
              <Text
                style={[styles.voteBadgeLabel, { color: colors.secondaryText }]}
              >
                Voto:
              </Text>
              <Text style={[styles.voteBadgeValue, { color: colors.success }]}>
                {getVoteLabel(voto.valor)}
              </Text>
            </View>
            <Text style={[styles.voteTime, { color: colors.secondaryText }]}>
              Confirmado em {formatVoteDate(voto.dataHora)}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.confirmedIcon,
            { backgroundColor: colors.success + "15" },
          ]}
        >
          <IconSymbol
            name="checkmark.seal.fill"
            size={24}
            color={colors.success}
          />
        </View>
      </View>
    </View>
  );

  const renderSectionHeader = ({ section }: { section: VoteSection }) => {
    const count = section.data.length;
    const subtitle =
      section.keyType === "pending"
        ? `${count} voto(s) pendentes`
        : `${count} voto(s) confirmados`;

    const containerStyles = [
      styles.sectionHeader,
      section.keyType === "pending"
        ? styles.sectionHeaderFirst
        : styles.sectionHeaderNext,
    ];

    return (
      <View style={containerStyles}>
        <View style={styles.sectionHeaderInfo}>
          <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>
            {section.title}
          </Text>
          <Text
            style={[styles.sectionSubtitle, { color: colors.secondaryText }]}
          >
            {subtitle}
          </Text>
        </View>
        {section.keyType === "pending" && count > 0 && (
          <TouchableOpacity
            style={[
              styles.sectionActionButton,
              { backgroundColor: colors.success },
            ]}
            onPress={handleAcceptAllVotes}
            activeOpacity={0.8}
          >
            <IconSymbol name="checkmark.circle" size={18} color="#ffffff" />
            <Text style={styles.sectionActionButtonText}>Aceitar Todos</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderSectionFooter = ({ section }: { section: VoteSection }) => {
    if (loading || !data) {
      return null;
    }

    // Seção de votos pendentes
    if (section.keyType === "pending") {
      // Se há votos pendentes, não mostra nada no footer
      if (section.data.length > 0) {
        return null;
      }

      // Se não há mais votos pendentes E há votos confirmados ou votos no total
      if (
        pendingVotes.length === 0 &&
        (confirmedVotes.length > 0 || data.votos.length > 0)
      ) {
        return (
          <View style={styles.sectionFooter}>
            <TouchableOpacity
              style={[
                styles.finishVotingButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={handleFinishVoting}
              disabled={updatingProjectStatus}
              activeOpacity={0.8}
            >
              <IconSymbol name="checkmark.circle" size={20} color="#ffffff" />
              <Text style={styles.finishVotingButtonText}>
                Finalizar Votação
              </Text>
            </TouchableOpacity>
          </View>
        );
      }

      // Se não há votos pendentes e também não há votos confirmados, mostra mensagem
      return (
        <View style={styles.sectionFooter}>
          <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
            Nenhum voto pendente
          </Text>
        </View>
      );
    }

    // Seção de votos confirmados
    if (section.keyType === "confirmed") {
      if (section.data.length > 0) {
        return null;
      }

      return (
        <View style={styles.sectionFooter}>
          <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
            Nenhum voto confirmado
          </Text>
        </View>
      );
    }

    return null;
  };

  const renderSectionItem = ({
    item,
    section,
  }: SectionListRenderItemInfo<Voto, VoteSection>) => {
    if (section.keyType === "pending") {
      return renderVoteItem({ item });
    }

    return renderConfirmedVoteItem({ item });
  };

  const renderProjectCard = () => {
    if (!project) return null;

    return (
      <View
        style={[
          styles.projectCard,
          {
            backgroundColor: "#ffffff",
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.projectCardHeader}>
          <View style={styles.projectTitleContainer}>
            <Text
              style={[styles.projectCardTitle, { color: colors.primaryText }]}
            >
              {project.titulo}
            </Text>
          </View>
          <View
            style={[
              styles.projectStatusBadge,
              { backgroundColor: colors.warning },
            ]}
          >
            <Text style={styles.projectStatusText}>Em Votação</Text>
          </View>
        </View>
        <Text
          style={[
            styles.projectCardDescription,
            { color: colors.secondaryText },
          ]}
        >
          {project.descricao}
        </Text>
        <View style={styles.projectCardFooter}>
          <Text
            style={[styles.projectAuthorText, { color: colors.secondaryText }]}
          >
            Autor: {project.autorNome} {project.autorSobrenome}
          </Text>
          <Text
            style={[styles.projectDateText, { color: colors.disabledText }]}
          >
            {formatDate(project.criadoEm, false)}
          </Text>
        </View>
        {/* Indicador de conexão SignalR */}
        {activeSession?.id && (
          <View style={styles.connectionStatus}>
            <View
              style={[
                styles.connectionDot,
                {
                  backgroundColor:
                    signalRStatus === "Conectado"
                      ? colors.success
                      : signalRStatus === "Reconectando..."
                      ? colors.warning
                      : signalRStatus === "Erro"
                      ? colors.error
                      : colors.warning,
                },
              ]}
            />
            <Text
              style={[
                styles.connectionText,
                {
                  color:
                    signalRStatus === "Conectado"
                      ? colors.success
                      : signalRStatus === "Reconectando..."
                      ? colors.warning
                      : signalRStatus === "Erro"
                      ? colors.error
                      : colors.secondaryText,
                },
              ]}
            >
              {signalRStatus === "Conectado"
                ? "Atualização em tempo real ativa"
                : signalRStatus === "Reconectando..."
                ? "Reconectando..."
                : signalRStatus === "Erro"
                ? "Erro na conexão"
                : signalRStatus === "Desconectado"
                ? "Desconectado"
                : "Conectando..."}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderHeader = () => {
    if (!data) return null;

    return (
      <>
        {renderProjectCard()}

        <View style={styles.summaryContainer}>
          <View
            style={[
              styles.summaryCard,
              { backgroundColor: "#ffffff", borderColor: colors.border },
            ]}
          >
            <Text style={[styles.summaryTitle, { color: colors.primaryText }]}>
              Resumo dos Votos
            </Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: colors.success }]}>
                  {data.votosSim}
                </Text>
                <Text
                  style={[styles.summaryLabel, { color: colors.secondaryText }]}
                >
                  Aprovar
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: colors.error }]}>
                  {data.votosNao}
                </Text>
                <Text
                  style={[styles.summaryLabel, { color: colors.secondaryText }]}
                >
                  Negar
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: colors.warning }]}>
                  {data.votosAbstencao}
                </Text>
                <Text
                  style={[styles.summaryLabel, { color: colors.secondaryText }]}
                >
                  Abstenção
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: colors.inactive }]}>
                  {data.votosFaltou}
                </Text>
                <Text
                  style={[styles.summaryLabel, { color: colors.secondaryText }]}
                >
                  Faltou
                </Text>
              </View>
            </View>
            <View style={styles.totalContainer}>
              <Text style={[styles.totalLabel, { color: colors.primaryText }]}>
                Total de Votos:
              </Text>
              <Text style={[styles.totalValue, { color: colors.info }]}>
                {data.votosTotais}
              </Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  const renderFooter = () => {
    // Footer vazio - o botão de finalizar está no footer da seção de votos pendentes
    return null;
  };

  if (loading && !data) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Spinner />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: "#ffffff",
              borderColor: colors.error,
            },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.error }]}>
            Erro ao Carregar
          </Text>
          <Text style={[styles.cardText, { color: colors.secondaryText }]}>
            {error}
          </Text>
        </View>
      </View>
    );
  }

  if (!project) {
    return (
      <View
        style={[styles.emptyContainer, { backgroundColor: colors.background }]}
      >
        <EmptyState
          icon="checkmark.square.fill"
          title="Nenhum projeto para confirmar"
          message="Não há projetos aguardando confirmação de votos no momento. Aguarde até que novos votos sejam enviados para revisão."
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SectionList<Voto, VoteSection>
        sections={sections}
        renderItem={renderSectionItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        renderSectionHeader={renderSectionHeader}
        renderSectionFooter={renderSectionFooter}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        stickySectionHeadersEnabled={false}
      />

      {/* Modal de confirmar aceitar todos */}
      <ConfirmationModal
        visible={acceptAllModal}
        title="Aceitar Todos os Votos"
        message="Deseja aceitar todos os votos pendentes?"
        confirmText="Aceitar"
        cancelText="Cancelar"
        onConfirm={handleConfirmAcceptAll}
        onCancel={() => setAcceptAllModal(false)}
        type="default"
      />

      {/* Modal de confirmar aceitar voto individual */}
      <ConfirmationModal
        visible={acceptVoteModal !== null}
        title="Aceitar Voto"
        message={`Deseja aceitar o voto de ${acceptVoteModal?.vereadorVotante.nome}?`}
        confirmText="Aceitar"
        cancelText="Cancelar"
        onConfirm={handleConfirmAcceptVote}
        onCancel={() => setAcceptVoteModal(null)}
        type="default"
      />

      {/* Modal de finalizar votação */}
      {finishVotingModal && data && (
        <FinishVotingModal
          visible={finishVotingModal}
          data={data}
          project={project}
          onApprove={handleConfirmFinishApprove}
          onReject={handleConfirmFinishReject}
          onCancel={() => setFinishVotingModal(false)}
          colors={colors}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },
  contentContainer: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  summaryContainer: {
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  sectionHeaderFirst: {
    marginTop: Spacing.lg,
  },
  sectionHeaderNext: {
    marginTop: Spacing.lg,
  },
  sectionHeaderInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
  sectionSubtitle: {
    fontSize: FontSizes.sm,
  },
  sectionActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  sectionActionButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: "#ffffff",
  },
  sectionFooter: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  summaryCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  summaryTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    gap: Spacing.sm,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryValue: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.xs,
  },
  summaryLabel: {
    fontSize: FontSizes.sm,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
    gap: Spacing.sm,
  },
  totalLabel: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
  totalValue: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
  },
  voteCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  voteCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: Spacing.md,
  },
  voteInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  vereadorName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  voteDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    flexWrap: "wrap",
  },
  voteBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs,
    alignSelf: "flex-start",
  },
  voteBadgeLabel: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.normal,
  },
  voteBadgeValue: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
  },
  voteTime: {
    fontSize: FontSizes.xs,
  },
  voteActions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  actionButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    minWidth: 80,
  },
  acceptButton: {
    // Estilo será aplicado dinamicamente
  },
  rejectButton: {
    // Estilo será aplicado dinamicamente
  },
  actionButtonText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: "#ffffff",
    textAlign: "center",
  },
  confirmedIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.sm,
  },
  cardText: {
    fontSize: FontSizes.md,
    lineHeight: 24,
    marginBottom: Spacing.xs,
  },
  loadingContainer: {
    paddingVertical: Spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    fontSize: FontSizes.md,
    textAlign: "center",
    paddingVertical: Spacing.xl,
  },
  footer: {
    height: Spacing.xl,
  },
  projectCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  projectCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  projectTitleContainer: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  projectCardTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  projectStatusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  projectStatusText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: "#ffffff",
  },
  projectCardDescription: {
    fontSize: FontSizes.md,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  projectCardFooter: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  projectAuthorText: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.xs,
  },
  projectDateText: {
    fontSize: FontSizes.xs,
  },
  connectionStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    gap: Spacing.xs,
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  connectionText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.normal,
  },
  finishVotingButton: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  finishVotingButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: "#ffffff",
  },
});

// Modal customizado para finalizar votação
interface FinishVotingModalProps {
  visible: boolean;
  data: VotosPorSessaoProjeto;
  project: Project | null;
  onApprove: () => void;
  onReject: () => void;
  onCancel: () => void;
  colors: any;
}

function FinishVotingModal({
  visible,
  data,
  project,
  onApprove,
  onReject,
  onCancel,
  colors,
}: FinishVotingModalProps) {
  // Calcula abstenção incluindo faltantes
  const abstencaoTotal = data.votosAbstencao + data.votosFaltou;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={finishModalStyles.overlay}>
        <View
          style={[
            finishModalStyles.modalContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <View style={finishModalStyles.content}>
            <Text
              style={[finishModalStyles.title, { color: colors.primaryText }]}
            >
              Finalizar Votação
            </Text>

            <View
              style={[
                finishModalStyles.warningBox,
                {
                  backgroundColor: colors.warning
                    ? `${colors.warning}20`
                    : "rgba(245, 158, 11, 0.2)",
                  borderColor: colors.warning || "#F59E0B",
                },
              ]}
            >
              <Text
                style={[
                  finishModalStyles.warningText,
                  { color: colors.primaryText },
                ]}
              >
                ⚠️ A sessão de votação deste projeto será finalizada e não será
                possível voltar atrás.
              </Text>
            </View>

            <Text
              style={[
                finishModalStyles.summaryTitle,
                { color: colors.primaryText },
              ]}
            >
              Resumo Final dos Votos
            </Text>

            <View style={finishModalStyles.summaryGrid}>
              <View style={finishModalStyles.summaryItem}>
                <Text
                  style={[
                    finishModalStyles.summaryValue,
                    { color: colors.success },
                  ]}
                >
                  {data.votosSim}
                </Text>
                <Text
                  style={[
                    finishModalStyles.summaryLabel,
                    { color: colors.secondaryText },
                  ]}
                >
                  Sim
                </Text>
              </View>
              <View style={finishModalStyles.summaryItem}>
                <Text
                  style={[
                    finishModalStyles.summaryValue,
                    { color: colors.error },
                  ]}
                >
                  {data.votosNao}
                </Text>
                <Text
                  style={[
                    finishModalStyles.summaryLabel,
                    { color: colors.secondaryText },
                  ]}
                >
                  Não
                </Text>
              </View>
              <View style={finishModalStyles.summaryItem}>
                <Text
                  style={[
                    finishModalStyles.summaryValue,
                    { color: colors.warning },
                  ]}
                >
                  {abstencaoTotal}
                </Text>
                <Text
                  style={[
                    finishModalStyles.summaryLabel,
                    { color: colors.secondaryText },
                  ]}
                >
                  Abstenção
                </Text>
              </View>
            </View>
            <View style={finishModalStyles.totalContainer}>
              <Text
                style={[
                  finishModalStyles.totalLabel,
                  { color: colors.primaryText },
                ]}
              >
                Total:
              </Text>
              <Text
                style={[
                  finishModalStyles.totalValue,
                  { color: colors.primary },
                ]}
              >
                {data.votosTotais}
              </Text>
            </View>

            <Text
              style={[
                finishModalStyles.observation,
                { color: colors.secondaryText },
              ]}
            >
              *Os faltantes ({data.votosFaltou}) foram contabilizados na
              abstenção.
            </Text>

            <View style={finishModalStyles.buttonsContainer}>
              <TouchableOpacity
                style={[
                  finishModalStyles.button,
                  finishModalStyles.rejectButton,
                  { backgroundColor: colors.error },
                ]}
                onPress={onReject}
                activeOpacity={0.8}
              >
                <Text style={finishModalStyles.buttonText}>
                  Rejeitar Projeto
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  finishModalStyles.button,
                  finishModalStyles.approveButton,
                  { backgroundColor: colors.success },
                ]}
                onPress={onApprove}
                activeOpacity={0.8}
              >
                <Text style={finishModalStyles.buttonText}>
                  Aprovar Projeto
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                finishModalStyles.cancelButton,
                { borderColor: colors.border },
              ]}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  finishModalStyles.cancelButtonText,
                  { color: colors.primaryText },
                ]}
              >
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const finishModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  warningBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  warningText: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
    textAlign: "center",
  },
  summaryTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryValue: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.xs,
  },
  summaryLabel: {
    fontSize: FontSizes.sm,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
    gap: Spacing.sm,
  },
  totalLabel: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
  totalValue: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
  },
  observation: {
    fontSize: FontSizes.xs,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  approveButton: {
    // Estilo será aplicado dinamicamente
  },
  rejectButton: {
    // Estilo será aplicado dinamicamente
  },
  buttonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: "#ffffff",
  },
  cancelButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    backgroundColor: "#ffffff",
  },
  cancelButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
});
