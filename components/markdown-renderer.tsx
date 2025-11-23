import React, { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MarkdownRendererProps {
  content: string;
  textColor: string;
  linkColor: string;
}

export function MarkdownRenderer({ content, textColor }: MarkdownRendererProps) {
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: ReactElement[] = [];
    let listItems: string[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];

    const flushList = (index: number) => {
      if (listItems.length > 0) {
        elements.push(
          <View key={`list-${index}`} style={styles.list}>
            {listItems.map((item, i) => (
              <View key={i} style={styles.listItem}>
                <Text style={[styles.bullet, { color: textColor }]}>• </Text>
                <Text style={[styles.text, { color: textColor }]}>{item}</Text>
              </View>
            ))}
          </View>
        );
        listItems = [];
      }
    };

    const flushCodeBlock = (index: number) => {
      if (codeBlockContent.length > 0) {
        elements.push(
          <View key={`code-${index}`} style={styles.codeBlock}>
            <Text style={[styles.codeText, { color: textColor }]}>
              {codeBlockContent.join('\n')}
            </Text>
          </View>
        );
        codeBlockContent = [];
      }
    };

    lines.forEach((line, index) => {
      // Code blocks
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          flushCodeBlock(index);
          inCodeBlock = false;
        } else {
          flushList(index);
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      // Headers
      if (line.startsWith('### ')) {
        flushList(index);
        elements.push(
          <Text key={index} style={[styles.h3, { color: textColor }]}>
            {line.substring(4)}
          </Text>
        );
        return;
      }

      if (line.startsWith('## ')) {
        flushList(index);
        elements.push(
          <Text key={index} style={[styles.h2, { color: textColor }]}>
            {line.substring(3)}
          </Text>
        );
        return;
      }

      if (line.startsWith('# ')) {
        flushList(index);
        elements.push(
          <Text key={index} style={[styles.h1, { color: textColor }]}>
            {line.substring(2)}
          </Text>
        );
        return;
      }

      // Lists
      if (line.trim().match(/^[-*]\s/)) {
        const item = line.trim().substring(2);
        listItems.push(item);
        return;
      }

      if (line.trim().match(/^\d+\.\s/)) {
        const item = line.trim().replace(/^\d+\.\s/, '');
        listItems.push(item);
        return;
      }

      // Regular text
      if (line.trim()) {
        flushList(index);
        
        // Parse inline markdown
        const parts = parseInlineMarkdown(line);
        elements.push(
          <Text key={index} style={[styles.paragraph, { color: textColor }]}>
            {parts}
          </Text>
        );
      } else {
        flushList(index);
        elements.push(<View key={index} style={styles.spacing} />);
      }
    });

    flushList(lines.length);
    flushCodeBlock(lines.length);

    return elements;
  };

  const parseInlineMarkdown = (text: string) => {
    const parts: (string | ReactElement)[] = [];
    let key = 0;

    // Bold **text**
    const boldRegex = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(
        <Text key={`bold-${key++}`} style={styles.bold}>
          {match[1]}
        </Text>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    // If no bold found, return plain text
    if (parts.length === 0) {
      return text;
    }

    return parts;
  };

  return (
    <View style={styles.container}>
      {parseMarkdown(content)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  h1: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 4,
  },
  h2: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 4,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 4,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  list: {
    marginBottom: 8,
    gap: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 16,
    lineHeight: 22,
    marginRight: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
  },
  bold: {
    fontWeight: '700',
  },
  codeBlock: {
    backgroundColor: 'rgba(128,128,128,0.3)',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 14,
    lineHeight: 20,
  },
  spacing: {
    height: 8,
  },
});
