'use client';

import { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import styles from './CommandPalette.module.css';

const tools = {
  image: [
    { name: 'Compress Image', path: '/image/compress' },
    { name: 'Convert Image', path: '/image/convert' },
    { name: 'Resize Image', path: '/image/resize' },
    { name: 'Image to PDF', path: '/image/to-pdf' },
  ],
  pdf: [
    { name: 'Compress PDF', path: '/pdf/compress' },
    { name: 'Merge PDF', path: '/pdf/merge' },
    { name: 'Split PDF', path: '/pdf/split' },
    { name: 'PDF to Images', path: '/pdf/to-images' },
  ],
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const router = useRouter();

  useEffect(() => {
    // Detect theme from the html element
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(currentTheme);

    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <>
        <div className={styles.overlay} onClick={() => setOpen(false)} />
        <Command.Dialog open={open} onOpenChange={setOpen} label="Global Command Menu" className={styles.dialog} data-theme={theme}>
            <Command.Input placeholder="Search for a tool..." className={styles.input} />
            <Command.List className={styles.list}>
                <Command.Empty>No results found.</Command.Empty>
                
                <Command.Group heading="Image Tools" className={styles.group}>
                    {tools.image.map((tool) => (
                        <Command.Item key={tool.path} onSelect={() => handleSelect(tool.path)} className={styles.item}>
                            {tool.name}
                        </Command.Item>
                    ))}
                </Command.Group>

                <Command.Group heading="PDF Tools" className={styles.group}>
                    {tools.pdf.map((tool) => (
                        <Command.Item key={tool.path} onSelect={() => handleSelect(tool.path)} className={styles.item}>
                            {tool.name}
                        </Command.Item>
                    ))}
                </Command.Group>

            </Command.List>
        </Command.Dialog>
    </>
  );
}
