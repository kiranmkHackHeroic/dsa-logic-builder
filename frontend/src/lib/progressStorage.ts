export type LocalStepProgress = {
  current_step: number;
  completed_steps: number[];
  code_solution?: string;
};

export const getLocalProgressKey = (problemId: string, scope: string = "guest") =>
  `problem-solving-progress:${scope}:${problemId}`;

export const readLocalProgress = (
  problemId: string,
  scope: string = "guest"
): LocalStepProgress | null => {
  try {
    const raw = localStorage.getItem(getLocalProgressKey(problemId, scope));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<LocalStepProgress>;

    return {
      current_step: Math.max(1, Number(parsed.current_step) || 1),
      completed_steps: Array.isArray(parsed.completed_steps)
        ? parsed.completed_steps.filter((step): step is number => Number.isInteger(step))
        : [],
      code_solution: typeof parsed.code_solution === "string" ? parsed.code_solution : undefined,
    };
  } catch {
    return null;
  }
};

export const writeLocalProgress = (
  problemId: string,
  progress: LocalStepProgress,
  scope: string = "guest"
) => {
  try {
    localStorage.setItem(getLocalProgressKey(problemId, scope), JSON.stringify(progress));
  } catch {
    // Ignore localStorage failures; DB save still handles persistence for signed-in users.
  }
};
