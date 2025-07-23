# apply_all_tool_replacements.py
import json
import shutil
from datetime import datetime
from pathlib import Path


class ToolReplacementProcessor:
    def __init__(self):
        self.project_root = Path(__file__).parent.parent
        self.tool_data_path = self.project_root / 'frontend' / 'src' / 'app' / 'utils' / 'toolData.js'

        # All replacements including the new ones
        self.replacements = {
            # Original CSV replacements
            'Supernormal': {
                'action': 'replace',
                'new_tool': 'Sembly',
                'url': 'https://www.sembly.ai',
                'description': 'AI meeting assistant with advanced transcription, summaries, and insights.',
                'category': 'Meeting Assistants',
                'reason': 'Falling behind in meeting assistant rankings'
            },
            'Decktopus': {
                'action': 'replace',
                'new_tool': 'Pitch',
                'url': 'https://pitch.com',
                'description': 'Collaborative presentation software with AI-powered design features.',
                'category': 'Deck Automation',
                'reason': 'Outpaced by Pitch in functionality and popularity'
            },
            'Genein': {
                'action': 'replace',
                'new_tool': 'Consensus',
                'url': 'https://consensus.app',
                'description': 'AI-powered academic search engine that finds insights from research papers.',
                'category': 'Research & Analysis',
                'reason': 'Lower traction compared to newer academic AI tools'
            },
            'CAMEL': {
                'action': 'replace',
                'new_tool': 'BabyAGI',
                'url': 'https://github.com/yoheinakajima/babyagi',
                'description': 'Task-driven autonomous agent framework for complex problem solving.',
                'category': 'None',
                'sector': 'Agent Builders',
                'type': 'enterprise',
                'reason': 'Research demo, not a practical tool'
            },
            'CrewAI SDK': {
                'action': 'replace',
                'new_tool': 'Haystack',
                'url': 'https://haystack.deepset.ai',
                'description': 'Open-source LLM orchestration framework for building AI applications.',
                'category': 'None',
                'sector': 'LLM Frameworks & Orchestration',
                'type': 'enterprise',
                'reason': 'SDK listing is redundant; Haystack more widely used'
            },
            'Fireworks.ai': {
                'action': 'replace',
                'new_tool': 'Cohere',
                'url': 'https://cohere.com',
                'description': 'Enterprise LLM platform with powerful language models and APIs.',
                'category': 'None',
                'sector': 'Model Hubs & Customization',
                'type': 'enterprise',
                'reason': 'Lower traction; Cohere is a top-tier model API platform'
            },
            'Tabnine': {
                'action': 'replace',
                'new_tool': 'Amazon CodeWhisperer',
                'url': 'https://aws.amazon.com/codewhisperer/',
                'description': 'AI coding companion from AWS with security scanning and code suggestions.',
                'category': 'None',
                'sector': 'AI Coding & App Platforms',
                'type': 'enterprise',
                'reason': 'CodeWhisperer is rising fast; Tabnine is declining'
            },
            # Additional replacements
            'Descript': {
                'action': 'replace',
                'new_tool': 'Leonardo AI',
                'url': 'https://leonardo.ai',
                'description': 'AI-powered creative platform for generating stunning visual content and artwork.',
                'category': 'Content Creation',
                'reason': 'Shifting focus to visual AI generation tools'
            },
            'Andi': {
                'action': 'replace',
                'new_tool': 'Seite',
                'url': 'https://seite.ai',
                'description': 'AI search tool designed for academic research and technical documentation.',
                'category': 'None',
                'sector': 'Enterprise Search & QA',
                'type': 'enterprise',
                'reason': 'Stronger AI search tools for niche users (academia or devs)'
            },
            'Klu': {
                'action': 'replace',
                'new_tool': 'Slack AI',
                'url': 'https://slack.com/features/ai',
                'description': 'Built-in AI features for Slack including search, summaries, and insights.',
                'category': 'None',
                'sector': 'Enterprise Search & QA',
                'type': 'enterprise',
                'reason': 'Built-in enterprise AI, growing rapidly in usage'
            },
            'Anysphere': {
                'action': 'replace',
                'new_tool': 'CodeGeeX',
                'url': 'https://codegeex.cn/en-US',
                'description': 'Multilingual AI coding assistant supporting 20+ programming languages.',
                'category': 'None',
                'sector': 'AI Coding & App Platforms',
                'type': 'enterprise',
                'reason': 'Modern coding tools with specific focus areas'
            }
        }

    def create_backup(self):
        """Create timestamped backup"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_path = f"{self.tool_data_path}.full_replacements_backup.{timestamp}"
        shutil.copy2(self.tool_data_path, backup_path)
        print(f"✅ Created backup: {backup_path}")
        return backup_path

    def parse_tool_data(self):
        """Parse the toolData.js file"""
        with open(self.tool_data_path, 'r') as f:
            content = f.read()

        start = content.find('[')
        end = content.rfind(']') + 1
        tools_json = content[start:end]

        tools = json.loads(tools_json)
        return tools, content[:start], content[end:]

    def process_replacements(self, tools):
        """Process all replacements"""
        updated_tools = []
        changes_made = {
            'replaced': [],
            'warnings': []
        }

        # Track which tools we've found
        tools_found = {name: False for name in self.replacements.keys()}

        for tool in tools:
            tool_name = tool.get('name', '')

            if tool_name in self.replacements:
                tools_found[tool_name] = True
                replacement = self.replacements[tool_name]

                # Store old data for report
                old_data = {
                    'name': tool['name'],
                    'url': tool['source_url'],
                    'id': tool['id']
                }

                # Update tool with new data
                tool['name'] = replacement['new_tool']
                tool['source_url'] = replacement['url']
                tool['short_description'] = replacement['description']

                # Update category/sector/type if specified
                if 'category' in replacement:
                    tool['category'] = replacement['category']
                if 'sector' in replacement:
                    tool['sector'] = replacement['sector']
                if 'type' in replacement:
                    tool['type'] = replacement['type']

                # Update screenshot path
                screenshot_name = replacement['new_tool'].lower().replace(' ', '_').replace('.', '')
                tool['screenshot_url'] = f"/screenshots/{screenshot_name}.png"

                changes_made['replaced'].append({
                    'old': old_data,
                    'new': {
                        'name': tool['name'],
                        'url': tool['source_url']
                    },
                    'reason': replacement['reason']
                })

                print(f"🔄 Replaced: {old_data['name']} → {tool['name']}")

            updated_tools.append(tool)

        # Check for tools not found
        for tool_name, found in tools_found.items():
            if not found:
                warning = f"Tool '{tool_name}' not found in toolData.js"
                print(f"⚠️  Warning: {warning}")
                changes_made['warnings'].append(warning)

        # Re-index tools
        for i, tool in enumerate(updated_tools):
            tool['id'] = str(i + 1)

        return updated_tools, changes_made

    def save_updated_tools(self, tools, prefix, suffix):
        """Save the updated tools back to toolData.js"""
        tools_json = json.dumps(tools, indent=2)
        new_content = prefix + tools_json + suffix

        with open(self.tool_data_path, 'w') as f:
            f.write(new_content)

        print(f"✅ Saved updated toolData.js")

    def generate_report(self, changes_made, initial_count, final_count):
        """Generate a detailed change report"""
        report = {
            'timestamp': datetime.now().isoformat(),
            'summary': {
                'initial_tool_count': initial_count,
                'final_tool_count': final_count,
                'total_replacements': len(changes_made['replaced'])
            },
            'replacements': changes_made['replaced'],
            'warnings': changes_made['warnings'],
            'screenshot_files_needed': [
                # From CSV replacements
                'sembly.png',
                'pitch.png',
                'consensus.png',
                'babyagi.png',
                'haystack.png',
                'cohere.png',
                'amazon_codewhisperer.png',
                # Additional replacements
                'leonardo_ai.png',
                'seite.png',
                'slack_ai.png',
                'codegeex.png'
            ],
            'alternative_options': {
                'Anysphere': 'Could also use CodiumAI instead of CodeGeeX',
                'Andi': 'Could also use Phind instead of Seite'
            }
        }

        report_path = 'complete-replacement-report.json'
        with open(report_path, 'w') as f:
            json.dump(report, f, indent=2)

        print(f"\n📊 Complete Replacement Report:")
        print(f"  - Initial tools: {initial_count}")
        print(f"  - Final tools: {final_count}")
        print(f"  - Total replacements: {len(changes_made['replaced'])}")
        if changes_made['warnings']:
            print(f"  - Warnings: {len(changes_made['warnings'])}")
        print(f"  - Report saved: {report_path}")

        print(f"\n📸 Screenshots needed for new tools:")
        for screenshot in report['screenshot_files_needed']:
            print(f"  - {screenshot}")

    def apply_replacements(self):
        """Main function to apply all replacements"""
        print("🔧 Applying All Tool Replacements (CSV + Additional)")
        print("=" * 80)

        # Create backup
        backup_path = self.create_backup()

        # Parse current tool data
        tools, prefix, suffix = self.parse_tool_data()
        initial_count = len(tools)
        print(f"Loaded {initial_count} tools from toolData.js\n")

        # Process replacements
        updated_tools, changes_made = self.process_replacements(tools)
        final_count = len(updated_tools)

        # Save updated tools
        self.save_updated_tools(updated_tools, prefix, suffix)

        # Generate report
        self.generate_report(changes_made, initial_count, final_count)

        print(f"\n✨ Done! Applied {len(changes_made['replaced'])} replacements")
        print(f"🔄 To revert: restore from {backup_path}")


if __name__ == "__main__":
    processor = ToolReplacementProcessor()
    processor.apply_replacements()