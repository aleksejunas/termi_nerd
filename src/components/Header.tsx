
import { Link, NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Terminal, ShieldCheck, LogOut, LogIn, Menu } from 'lucide-react';
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

const navItems = [
    { to: "/about", label: "About" },
    { to: "/projects", label: "Projects" },
    { to: "/contact", label: "Contact" },
    { to: "/blog", label: "Blog" },
    { to: "/guestbook", label: "Guestbook" },
];

export function Header() {
    const { data: isAdmin } = useIsAdmin();
    const [session, setSession] = useState<Session | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            queryClient.invalidateQueries({ queryKey: ['userIsAdmin'] });
        });

        return () => subscription.unsubscribe();
    }, [queryClient]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    return (
        <header className="p-4 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 text-lg font-bold hover:text-primary transition-colors">
                    <Terminal className="text-terminal-green h-5 w-5" />
                    <h1 className="font-mono text-terminal-green">/home/</h1>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                cn(
                                    "text-lg font-medium text-muted-foreground transition-colors hover:text-primary",
                                    isActive && "text-primary"
                                )
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                    {isAdmin && (
                         <NavLink
                            to="/admin"
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-1 text-lg font-medium text-muted-foreground transition-colors hover:text-primary",
                                    isActive && "text-primary"
                                )
                            }
                        >
                            <ShieldCheck className="h-5 w-5" />
                            Admin
                        </NavLink>
                    )}
                    {session ? (
                        <Button variant="ghost" size="sm" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" /> Logout
                        </Button>
                    ) : (
                        <Button variant="ghost" size="sm" asChild>
                            <Link to="/login">
                                <LogIn className="mr-2 h-4 w-4" /> Login
                            </Link>
                        </Button>
                    )}
                </nav>

                {/* Mobile Navigation */}
                <div className="md:hidden">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <SheetHeader>
                                <SheetTitle>
                                    <Link to="/" className="inline-flex items-center gap-2 text-lg font-bold hover:text-primary transition-colors" onClick={() => setIsSheetOpen(false)}>
                                        <Terminal className="text-terminal-green h-5 w-5" />
                                        <h1 className="font-mono text-terminal-green">/home/</h1>
                                    </Link>
                                </SheetTitle>
                            </SheetHeader>
                            <nav className="mt-8 flex flex-col gap-2">
                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        onClick={() => setIsSheetOpen(false)}
                                        className={({ isActive }) => cn(
                                            "text-xl font-medium text-muted-foreground transition-colors hover:text-primary hover:bg-muted/50 p-3 rounded-md",
                                            isActive && "text-primary bg-muted"
                                        )}
                                    >
                                        {item.label}
                                    </NavLink>
                                ))}
                                {isAdmin && (
                                    <NavLink
                                        to="/admin"
                                        onClick={() => setIsSheetOpen(false)}
                                        className={({ isActive }) => cn(
                                            "flex items-center gap-2 text-xl font-medium text-muted-foreground transition-colors hover:text-primary hover:bg-muted/50 p-3 rounded-md",
                                            isActive && "text-primary bg-muted"
                                        )}
                                    >
                                        <ShieldCheck className="h-5 w-5" />
                                        Admin
                                    </NavLink>
                                )}
                                <div className="border-t border-border pt-4 mt-2">
                                {session ? (
                                    <Button variant="ghost" className="w-full justify-start p-3 text-xl" size="lg" onClick={() => {handleLogout(); setIsSheetOpen(false);}}>
                                        <LogOut className="mr-2 h-5 w-5" /> Logout
                                    </Button>
                                ) : (
                                    <Button variant="ghost" className="w-full justify-start p-3 text-xl" size="lg" asChild>
                                        <Link to="/login" onClick={() => setIsSheetOpen(false)}>
                                            <LogIn className="mr-2 h-5 w-5" /> Login
                                        </Link>
                                    </Button>
                                )}
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
