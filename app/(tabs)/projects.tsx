import { ThemedText } from "@/src/components/layout/themed-text";
import { Fonts } from "@/src/constants/theme";

export default function ProjectsScreen() {
  return (
    <ThemedText
      type="title"
      style={{
        fontFamily: Fonts.rounded,
      }}
    >
      Projetos
    </ThemedText>
  );
}
