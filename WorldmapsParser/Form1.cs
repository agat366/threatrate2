using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Xml;

namespace WorldmapsParser
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            ProcessFile(false);
        }

        private string GetDescChildValue(List<XmlNode> attributes, string name)
        {
            return attributes.FirstOrDefault(x => x.Name.ToLower() == name)?.InnerText ?? "";
        }

        private static string GetColorFill(string color)
        {
            if (string.IsNullOrEmpty(color))
            {
                return "''";
            }
            color = color.ToLower();
            if (color == "#fff" || color == "#ffffff")
            {
                return "transparentColor || '#fff'";
            }
            return $"color || '{color}'";
        }

        private void button3_Click(object sender, EventArgs e)
        {
            ProcessFile(true);
        }

        private void ProcessFile(bool asDictionary)
        {
            var fileDialog = new System.Windows.Forms.OpenFileDialog();
            fileDialog.Filter = "Svg (.svg)|*.svg";

            var count = 0;
            var countRank2 = 0;

            DialogResult result = fileDialog.ShowDialog(); // Show the dialog.
            if (result == DialogResult.OK) // Test result.
            {
                string file = fileDialog.FileName;
                var output = new StringBuilder();
                var output2 = new StringBuilder();
                try
                {
                    var xml = new XmlDocument();
                    xml.Load(file);

                    var svgNode = xml.GetElementsByTagName("svg")[0];
                    var h = Convert.ToDecimal(Regex.Replace(svgNode.Attributes?["height"]?.Value ?? "", @"[a-zA-Z]", ""));
                    var w = Convert.ToDecimal(Regex.Replace(svgNode.Attributes?["width"]?.Value ?? "", @"[a-zA-Z]", ""));

                    var paths = xml.GetElementsByTagName("path");

                    foreach (XmlNode path in paths)
                    {
                        var d = path.Attributes?["d"]?.Value;
                        d = Regex.Replace(d ?? "", @"[\n\s]", "");

                        var children = new List<XmlNode>();
                        foreach (XmlNode node in path.ChildNodes)
                        {
                            children.Add(node);
                        }
                        var desc = children.FirstOrDefault(x => x.Name.ToLower() == "desc");
                        if (desc != null)
                        {
                            var attributes = new List<XmlNode>();
                            foreach (XmlNode node in desc.ChildNodes)
                            {
                                attributes.Add(node);
                            }
                            var data = new
                            {
                                title = GetDescChildValue(attributes, "name"),
                                rank = GetDescChildValue(attributes, "labelrank"),
                                region = GetDescChildValue(attributes, "region-wb"),
                                subregion = GetDescChildValue(attributes, "subregion"),
                                isoA2 = GetDescChildValue(attributes, "iso-a2"),
                                isoA3 = GetDescChildValue(attributes, "iso-a3"),
                                continent = GetDescChildValue(attributes, "continent"),
                                key = GetDescChildValue(attributes, "hc-key")
                            };

                            count++;
                            if (data.rank == "2")
                            {
                                countRank2++;
                            }

                            output2.AppendLine("");
                            output2.AppendLine("    countries.push({");
                            output2.AppendLine($"        title: '{data.title}',");
                            output2.AppendLine($"        rank: '{data.rank}',");
                            output2.AppendLine($"        region: '{data.region}',");
                            output2.AppendLine($"        subregion: '{data.subregion}',");
                            output2.AppendLine($"        iso2: '{data.isoA2}',");
                            output2.AppendLine($"        iso3: '{data.isoA3}',");
                            output2.AppendLine($"        continent: '{data.continent}',");
                            output2.AppendLine($"        key: '{data.key}',");
                            output2.AppendLine("    });");

                            output.AppendLine($"");
                            output.AppendLine($"    // {data.title}");
                            output.AppendLine($"    case 'countries.{data.isoA2.ToLower()}':");
                            output.AppendLine($"        w = {w};");
                            output.AppendLine($"        h = {h};");
                            output.AppendLine($"");
                            output.AppendLine($"        // placeholder");
                            output.AppendLine($"");

                            var fill = GetColorFill(path.Attributes?["fill"]?.Value);
                            output.AppendLine("        g.append('path')");
                            output.AppendLine($"            .attr('d', '{ d }')");
                            output.AppendLine($"            .attr('fill', { fill });");

                            output.AppendLine($"        break;");
                        }
                        else
                        {
                            output.AppendLine("        // not recognized");
                            output.AppendLine("        // " + path.OuterXml);
                        }
                    }
                }
                catch (IOException ex)
                {
                    output.AppendLine("");
                    output.AppendLine("===========================");
                    output.AppendLine(ex.Message);
                    output.AppendLine("===========================");
                }

                lblCount.Text = $"{count} ({countRank2})";
                txtOutput.Text = asDictionary ? output2.ToString() : output.ToString();
            }

        }

        private void label1_Click(object sender, EventArgs e)
        {

        }
    }
}
