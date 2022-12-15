import { Box } from "@chakra-ui/react";
import TasksList from "../components/tasks/tasks-list";

export default function HomePage() {
  return (
    <Box as="main">
      <TasksList />
    </Box>
  );
}
