import { VStack } from "@chakra-ui/react";
import Loader from "../shared/loader";
import { useTasks } from "../../lib/hooks";

export default function TasksList() {
  var { tasks, loading } = useTasks();

  if (loading) {
    return (
      <VStack>
        <Loader />
      </VStack>
    );
  }

  return (
    <VStack>
      {tasks.length} {loading ? "Loading..." : "Tasks"}
    </VStack>
  );
}
