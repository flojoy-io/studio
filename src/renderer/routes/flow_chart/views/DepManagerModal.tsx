import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/renderer/components/ui/dialog";
import { Button } from "@/renderer/components/ui/button";
import { ScrollArea } from "@/renderer/components/ui/scroll-area";
import { Spinner } from "@/renderer/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/renderer/components/ui/table";
import { useCallback, useEffect, useState } from "react";
import { PoetryGroupInfo, PythonDependency } from "src/types/poetry";
import { Input } from "@/renderer/components/ui/input";
import { categoryMap } from "../../common/Sidebar/SidebarNode";

type Props = {
  handleDepManagerModalOpen: (open: boolean) => void;
  isDepManagerModalOpen: boolean;
};

const DepManagerModal = ({
  isDepManagerModalOpen,
  handleDepManagerModalOpen,
}: Props) => {
  const [allDependencies, setAllDependencies] = useState<PythonDependency[]>([]);
  const [userDependencies, setUserDependencies] = useState<PythonDependency[]>([]);
  const [installDependency, setInstallDependency] = useState<string>("");
  const [depGroups, setDepGroups] = useState<PoetryGroupInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [msg, setMsg] = useState<string>("");
  const [checkAllDependencies, setCheckAllDependencies] = useState<boolean>(false);

  const handleUpdate = useCallback(async () => {
    setIsFetching(true);
    setMsg("Fetching dependencies...");
    const deps = await window.api.poetryShowTopLevel();
    const userDeps = await window.api.poetryShowUserGroup();
    const groups = await window.api.poetryGetGroupInfo();
    setAllDependencies(deps);
    setUserDependencies(userDeps);
    console.log(userDependencies);
    setDepGroups(groups);
    setIsFetching(false);
  }, []);

  const handleGroupInstall = useCallback(async (groupName: string) => {
    setMsg("Installing...");
    setIsLoading(true);
    await window.api.poetryInstallDepGroup(groupName);
    await handleUpdate();
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUserDepInstall = useCallback(async (depName: string) => {
    setMsg("Installing...");
    setIsLoading(true);
    await window.api.poetryInstallDepUserGroup(depName);
    await handleUpdate();
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGroupUninstall = useCallback(async (groupName: string) => {
    setMsg("Removing...");
    setIsLoading(true);
    await window.api.poetryUninstallDepGroup(groupName);
    await handleUpdate();
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getButtonLabel = useCallback((status: PoetryGroupInfo["status"]) => {
    switch (status) {
      case "installed":
        return "Uninstall";
      case "dne":
        return "Install";
      default:
        return "Unknown";
    }
  }, []);

  useEffect(() => {
    if (isDepManagerModalOpen) {
      handleUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDepManagerModalOpen]);

  useEffect(() => {
    window.api.subscribeToElectronLogs((data) => {
      if (data.trimStart().startsWith("•")) {
        setMsg(data);
      }
    });
  }, []);

  return (
    <Dialog
      open={isDepManagerModalOpen}
      onOpenChange={handleDepManagerModalOpen}
    >
      <DialogContent className="flex h-4/5 max-w-5xl flex-col">
        <DialogHeader>
          <DialogTitle className="text-3xl">Dependency Manager</DialogTitle>
          <DialogDescription>
            Here you can manage all the Python dependencies for Flojoy.
          </DialogDescription>
        </DialogHeader>

          { !checkAllDependencies ? (
          <div className="h-full flex flex-col justify-between">
            <ScrollArea className="p-4 h-full">
              

              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">Flojoy Extensions</div>
              </div>
              <div className="py-2" />
              <div>
                {depGroups.length === 0 && ( <div className="flex justify-center items-center h-screen"><Spinner className="text-center" /></div>)}
                {depGroups.map((group) => {
                  return (
                    <div className="flex p-1" key={group.name}>
                      <div className="w-32">{group.name}</div>
                      <div>{group.description}</div>
                      <div className="grow" />
                      <Button
                        data-testid={`${group.name}-${getButtonLabel(
                          group.status,
                        )}`}
                        disabled={isLoading || group.name === "blocks"}
                        variant={
                          group.status === "installed" ? "destructive" : "default"
                        }
                        onClick={() => {
                          if (group.status === "installed") {
                            handleGroupUninstall(group.name);
                          } else {
                            handleGroupInstall(group.name);
                          }
                        }}
                      >
                        {getButtonLabel(group.status)}
                      </Button>
                    </div>
                  );
                })}
              </div>
              <div className="py-2" />


              <div className="py-2" />
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">User Dependencies</div>
              </div>
              <div className="py-2" />
              <h2 className="pb-2 pr-2 text-muted-foreground">Install dependencies</h2>
              <div className="flex">
                <div className="pl-1 flex-auto items-center gap-1.5">
                  <Input id="deps" placeholder="numpy pytest==7.4.4" value={installDependency} onChange={(event) => {setInstallDependency(event.target.value)}}/>
              </div>
              <Button
                className="ml-4"
                disabled={isLoading}
                variant={"default"}
                onClick={() => {
                  handleUserDepInstall(installDependency);
                }}
              >
                Install
              </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                { userDependencies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                        { isLoading ? <Spinner/> : "No user dependencies installed." }
                    </TableCell>
                  </TableRow>
                  ) :
                  userDependencies.map((dep) => (
                  <TableRow key={dep.name}>
                    <TableCell>{dep.name}</TableCell>
                    <TableCell>{dep.version}</TableCell>
                    <TableCell>{dep.description}</TableCell>
                  </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="py-2" />

              
            </ScrollArea>
            <div className="flex justify-between text-muted-foreground text-xs">
              <div className="flex justify-start mt-4">
                {!isLoading && !isFetching ? (
                  <p> Dependency Manager Idle </p>
                ) : (
                  <p> {msg} </p>
                )}
              </div>
              <div className="flex justify-end">
                <Button variant={"link"} onClick={() => setCheckAllDependencies(true)}> 
                  <p className="text-muted-foreground mt-2 text-xs"> Consult all dependencies </p> 
                </Button>
              </div>
            </div>
          </div>

          ) : (
            <ScrollArea className="p-4 h-full">
            <div>
              <div className="py-2" />
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">All Dependencies</div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allDependencies
                    .filter((dep) => dep.installed)
                    .map((dep) => (
                      <TableRow key={dep.name}>
                        <TableCell>{dep.name}</TableCell>
                        <TableCell>{dep.version}</TableCell>
                        <TableCell>{dep.description}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <div className="py-2" />

              <div className="flex justify-start">
                <Button variant={"link"} onClick={() => setCheckAllDependencies(false)}>
                  <p className="text-muted-foreground mt-2 text-xs">Back</p>
                </Button>
              </div>
            </div>
            </ScrollArea>
          )}
      </DialogContent>
    </Dialog>
  );
};

export default DepManagerModal;
