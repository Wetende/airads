import glob
import re

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. Fix </Grid> after Badge map
    content = content.replace('</Badge>\n                      ))}\n                    </Grid>', '</Badge>\n                      ))}\n                    </div>')
    
    # 2. Fix </Paper> -> </CardContent>\n</Card> at the end of course map
    content = content.replace('</Button>\n                \n              </Paper>', '</Button>\n                </CardContent>\n              </Card>')
    
    # 3. Fix </Grid> after course map
    content = content.replace('              </Card>\n            ))}\n          </Grid>', '              </Card>\n            ))}\n          </div>')
    
    # 4. Fix </Grid> after career map
    content = content.replace('</span>\n                </div>\n              ))}\n            </Grid>', '</span>\n                </div>\n              ))}\n            </div>')
    
    # 5. Fix <Box></Grid> at the very end
    content = content.replace('          </Box>\n</Grid>\n        </div>\n      </section>\n\n      <Footer />\n    </div>', '          </div>\n        </div>\n      </section>\n\n      <Footer />\n    </div>')

    # 6. Fix </Paper> under facilities map
    content = content.replace('</Typography>\n                \n              </Paper>\n            ))}\n          </Grid>', '</Typography>\n                </CardContent>\n              </Card>\n            ))}\n          </div>')

    # 7. Fix </Box></Grid> at the end of section descriptions
    # For instance:
    #             <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
    #               Professional-grade facilities that mirror real salon and spa environments
    #             </Typography>
    #           </Box>
    # </Grid>
    content = re.sub(r'</Typography>\n\s*</Box>\n</Grid>\n\n\s*<div className="grid', r'</Typography>\n          </div>\n\n          <div className="grid', content)
    
    # 8. Fix </Paper> under School Overview cards
    content = content.replace('</Typography>\n              </Paper>', '</Typography>\n              </CardContent>\n            </Card>')

    with open(filepath, 'w') as f:
        f.write(content)

for filepath in glob.glob('frontend/src/pages/public/schools/*.jsx'):
    fix_file(filepath)

